import * as React from 'react'
import { useSpring, animated } from 'react-spring'
import { useGesture } from 'react-use-gesture'

const HorizontalScrollView = ({ children, ...props }) => {
    const ref = React.useRef();
    const isDragging = React.useRef(false);
    const [{ x }, set, stop] = useSpring(() => ({ x: 0 }));
    const bind = useGesture(
      {
        onDrag({ down, movement: [x], first, last, vxvy: [vx] }) {
          console.log("onDrag with movement", { x, first, last, vx, down });
          if (first) isDragging.current = true;
          if (last) setTimeout(() => (isDragging.current = false), 0);
          set({ x: -x, immediate: down });
        },
        onClickCapture(e) {
          if (isDragging.current && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
          }
        },
        onWheelStart() {
          // Stop any user-land scroll animation from confcliting with the browser
          if (typeof stop === 'function') stop();
        }
      },
      {
        drag: {
          axis: "x",
          filterTaps: true,
          initial() {
            console.log("Initial x value", -ref.current.scrollLeft);
            return [-ref.current.scrollLeft, 0];
          }
        }
      }
    );
  
    return (
      <animated.div
        ref={ref}
        scrollLeft={x}
        {...bind()}
        {...props}
      >
        {children}
      </animated.div>
    );
  }

  export default HorizontalScrollView
import SvgColor from 'src/components/svg-color/SvgColor'

const Icon = ({ name, width = 1, height = 1, sx = {}, ...props }: { name: string, width: number, height: number, sx: Object, props: any }) => {
    return (
        <SvgColor
            src={`/assets/icons/${name}.svg`}
            sx={(theme) => ({
                width,
                height,
                ...(typeof sx === 'function' ? sx(theme) : sx),
            })}
            {...props}
        />
    )
}

export default Icon
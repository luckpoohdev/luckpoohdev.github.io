import useRouter from 'src/hooks/useRouter';

// ----------------------------------------------------------------------

type ReturnType = {
  active: boolean;
  isExternalLink: boolean;
};

export default function useActiveLink(path: string | { root: string }, depth = 1, deep = true): ReturnType {
  
  const router = useRouter();
  const currentPath = router.asPath.split('/')
  const comparisonPath = (typeof path === 'string' ? path : path.root).split('/')
  const active = currentPath[depth] === comparisonPath[depth] && (depth === 1 || currentPath[depth-1] === comparisonPath[depth-1])

  return {
    active,
    isExternalLink: (typeof path === 'string' ? path : path.root).includes('http'),
  };
}

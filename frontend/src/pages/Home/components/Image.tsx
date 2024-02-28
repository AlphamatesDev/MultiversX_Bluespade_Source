const Image = (props: { src: string, alt: string, property: unknown }) => {
  const { src, alt } = props
  return (
    <img src={src} alt={alt} loading='lazy' />
  )
}

export default Image
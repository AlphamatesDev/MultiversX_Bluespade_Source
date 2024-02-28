const Button = (props: { action: () => void }) => {
  const { action, children } = props
  return (
    <button onClick={action}>{children}</button>
  )
}

export default Button
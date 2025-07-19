import "./Input.css"
const Input = (props) => {
  return (
    <input 
      type={props.type} 
      name={props?.name | ""}
      id={props?.id}
      className={props?.className}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  )
}
export default Input;
const ProgressBar = (props) => {
    const { bgcolor, completed, height } = props;
  
    const containerStyles = {
      height: height,
      width: '100%',
      backgroundColor: "#000000",
      borderRadius: 50,
    }
  
    const fillerStyles = {
      height: '100%',
      width: `${completed}%`,
      backgroundColor: bgcolor,
      borderRadius: 'inherit',
      textAlign: 'right'
    }
  
    // const labelStyles = {
    //   padding: 5,
    //   color: 'white',
    //   fontWeight: 'bold'
    // }
  
    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;
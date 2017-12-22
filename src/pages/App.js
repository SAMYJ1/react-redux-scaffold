import React, {Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


import logo from '../logo.svg';
import * as tests from '../reducers/test'



class App extends Component{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  componentDidMount(){
    this.props.foo({a:1, b:2})
    setTimeout(()=>{
      this.props.bar()
    },3000)
  }

  handleClick(){

  }


  render(){


    return(
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <input type="button" onClick={::this.handleClick} value={'test'}/>
      </div>
    )
  }
}

export default connect(({test})=>{
  return {
    test
  }
}, dispatch => bindActionCreators({...tests}, dispatch))(App)
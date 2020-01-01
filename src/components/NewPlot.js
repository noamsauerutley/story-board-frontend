import React from 'react'
import { connect } from 'react-redux'
import { set_plot } from '../redux/actions'
import { Redirect } from 'react-router'
import styled from 'styled-components'
import { colors } from '../assets/colors'
import { StyledTextArea, StyledSubmit, StyledLabel, StyledTextInput } from '../assets/StyledComponents'


class NewPlot extends React.Component {

    state = {
        name: "",
        summary: "",
        redirectBoolean: false,
        errors: []
    }
    
    newPlotSubmitted = async (event) => {
        event.preventDefault()
        let rawPlot = await fetch ('http://localhost:3000/plots', 
        {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": localStorage.token
            },
            body: JSON.stringify({plot: {
                story_id: this.props.currentStory.id,
                name: this.state.name,
                summary: this.state.summary
            }})
          })
          let plot = await rawPlot.json()
          if (plot.errors) {
            this.setState({
              errors: plot.errors
            })
          } else {
        console.log(plot)
        this.props.set_plot(plot)
        this.setState({
          redirectBoolean: true
        })
        console.log(this.state)
          }
    }

    onChange = event => {
        this.setState({
          [event.target.name]: event.target.value
        })
      }

      renderOrRedirect = () => {
        if(this.state.redirectBoolean === true){
          console.log(this.state)
           return <Redirect to={`/stories/${this.props.currentStory.id}`} />} 
           else {
             console.log(this.state)
           return <section style={{textAlign: "center"}}>
              <h2 >NEW PLOT ARC</h2>
              <br></br>
              <form onSubmit={ this.newPlotSubmitted }>
                  <br></br>
                  <StyledLabel  htmlFor="new_plot_name">NAME</StyledLabel>
                  <br></br>
                  <StyledTextInput 
                      id="new_plot_name" 
                      type="text" 
                      onChange={ this.onChange /* for controlled form input status */ } 
                      name="name" 
                      value={ this.state.name /* for controlled form input status */ } />
                      <br></br>
                      <br></br>
                  <StyledLabel  htmlFor="new_plot_summary">SUMMARY</StyledLabel>
                  <br></br>
                  <StyledTextArea   
                      style={{width: "80%", height: "300px"}}
                      id="new_plot_summary" 
                      onChange={ this.onChange } 
                      name="summary" 
                      value={ this.state.summary } />
                      <br></br><br></br>
                      <StyledSubmit 
                    type="submit" 
                    value="✓"
                    />              </form>
              </section>}
      }

    render(){
        return(
          <>
         {this.renderOrRedirect()}
         </>
        )}
}

const mapStateToProps = (state) => {
    return {
      currentStory: state.currentStory
    }
  }
const mapDispatchToProps = (dispatch) => {
    return {
        set_plot: (plot) => {
            dispatch(set_plot(plot))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPlot)

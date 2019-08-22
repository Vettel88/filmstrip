import React from 'react'
import { Redirect } from 'react-router-dom'
import { TextField, Button, Typography } from 'rmwc'
import { ResponseFrame } from './ResponseFrame.jsx'
import { prepareResponseView } from './ResponseCommon.jsx'
import { ResponseSave } from '/imports/methods/Response.js'

class ResponseQuestionnaireContainer extends React.Component {

    state = {
        email: this.props.email,
        currentFrameIndex: 0,
        responses: []
    }

    prevQuestion = (event) => {
        event.preventDefault()
        this.setState({
            currentFrameIndex: this.state.currentFrameIndex - 1
        })
    }

    getResponsesFromLocalStorage = () => {
    }

    nextQuestion = (event) => {

        if(this.state.currentFrameIndex === this.props.filmstrip.frames.length -1) {

            const frames = this.props.filmstrip.frames.map(frame => {

                return Object.assign({
                    no: frame.no,
                    responseToFrameId: frame._id,
                    responseToFilmstripId: this.props.filmstrip._id
                }, JSON.parse(localStorage.getItem(frame._id)))

            })

            const filmstrip = {
                responseToFilmstripId: this.props.filmstrip._id,
                name: this.props.filmstrip.name,
                email: this.props.email
            }

            ResponseSave.call({
                filmstrip,
                frames
            }, (err, res) => {
                if(err) console.error(err)
                else {
                    this.setState({
                        createdFilmstripId: res,
                        toFinish: true
                    })
                }
            })

        }
        else {

            this.setState({
                currentFrameIndex: this.state.currentFrameIndex + 1
            })

        }

    }

    render() {
        const { t, filmstrip } = this.props

        const frames = filmstrip.frames
        const currentFrame = frames[this.state.currentFrameIndex];
        const prevQuestionClass = this.state.currentFrameIndex === 0 ? 'disabled' : '';

        if (this.state.toFinish === true) {
            const url = `/a/${filmstrip._id}/${btoa(this.props.email)}/${this.state.createdFilmstripId}/finish`;
            return <Redirect to={url} />
        }

        return (
            <div className='centered ResponseQuestionnaireContainer ResponseQuestionnaireContainerPad'>
                <h5><Typography use='headline5'>{filmstrip.name}</Typography></h5>
                <ResponseFrame key={currentFrame._id} frame={currentFrame} t={t} filmstrip={filmstrip} currentFrameIndex={this.state.currentFrameIndex} />
                <div className='ResponseNavigationButtons'>
                    <a onClick={this.prevQuestion} className={prevQuestionClass}>
                        <Typography use='button'>
                            { t('Response.PrevQuestion') }
                        </Typography>
                    </a>
                    <a onClick={this.nextQuestion}>
                        <Typography use='button'>
                            { this.state.currentFrameIndex + 1 === frames.length ? t('Response.Finish') : t('Response.NextQuestion') }
                        </Typography>
                    </a>
                </div>
            </div>
        )

    }

}

export const ResponseQuestionnaire = prepareResponseView(ResponseQuestionnaireContainer)

import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import React from 'react'
import { Redirect } from 'react-router-dom'
import { TextField, Button, Typography } from 'rmwc'
import { AnswerFrame } from './AnswerFrame.jsx'
import { prepareAnswerView } from './AnswerCommon.jsx'

class AnswerQuestionnaireContainer extends React.Component {

    state = {
        email: this.props.email,
        currentFrameIndex: 0,
        answers: []
    }

    handleChange = (event) => {
        console.log(event)
    }

    handleSubmit = (event) => {
        event.preventDefault()
    }

    prevQuestion = (event) => {
        event.preventDefault()
        this.setState({
            currentFrameIndex: this.state.currentFrameIndex - 1
        })
    }

    getAnswersFromLocalStorage = () => {
    }

    nextQuestion = (event) => {

        if(this.state.currentFrameIndex === this.props.filmstrip.frames.length -1) {

            const frames = this.props.filmstrip.frames.map(frame => {

                return Object.assign({
                    _id: Random.id(),
                    no: frame.no,
                    answerToFrameId: frame._id,
                    answerToFilmstripId: this.props.filmstrip._id
                }, JSON.parse(localStorage.getItem(frame._id)))

            })

            const filmstrip = {
                answerToFilmstripId: this.props.filmstrip._id,
                name: this.props.filmstrip.name,
                frameIds: frames.map(f => f._id),
                email: this.props.email
            }

            console.log("Finished", frames)

            Meteor.call('answer.save', {
                filmstrip,
                frames
            }, (err, res) => {
                if(err) console.error(err)
                else {
                    //localStorage.clear()
                    console.log(res)
                    this.setState({
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
            const url = `/a/${filmstrip._id}/${btoa(this.props.email)}/finish`;
            return <Redirect to={url} />
        }

        return (
            <div className='centered AnswerQuestionnaireContainer AnswerQuestionnaireContainerPad'>
                <h5><Typography use='headline5'>{filmstrip.name}</Typography></h5>
                <AnswerFrame key={currentFrame._id} frame={currentFrame} t={t} filmstrip={filmstrip} currentFrameIndex={this.state.currentFrameIndex} />
                <div className='AnswerNavigationButtons'>
                    <a onClick={this.prevQuestion} className={prevQuestionClass}>
                        <Typography use='button'>
                            { t('AnswerPrevQuestion') }
                        </Typography>
                    </a>
                    <a onClick={this.nextQuestion}>
                        <Typography use='button'>
                            { this.state.currentFrameIndex + 1 === frames.length ? t('AnswerFinish') : t('AnswerNextQuestion') }
                        </Typography>
                    </a>
                </div>
            </div>
        )

    }

}

export const AnswerQuestionnaire = prepareAnswerView(AnswerQuestionnaireContainer)

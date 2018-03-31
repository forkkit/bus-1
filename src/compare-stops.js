import React, { Component } from 'react'
import styled from 'styled-components'
import Header from './header'
import { firstStop, secondStop, e11 } from './stops'
import caretDown from './caret-down.svg'

const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  font-weight: inherit;
  color: inherit;
  padding: 0 16px 0 0;
  background-color: transparent;
  border-radius: 0;
  border: 0;
  ${props => props.fullWidth && `width: 100%;`}
  background-image: url(${caretDown});
  background-repeat: no-repeat;
  background-position: top 9px right;
  outline: 0;
`

const Wrapper = styled.div`

`

const TopSection = styled.div`
  background-color: white;
  position: sticky;
  top: 0;
  padding: 16px 24px 0 24px;
  z-index: 1;
`

const MainSection = styled.div`

`

const HeaderWrapper = styled.div`
  border-bottom: 1px solid rgba(0, 22, 43, .1);
  padding-bottom: 16px;
`

const StopsSection = styled.div`
  display: flex;
`

const StopWrapper = styled.div`
  width: 50%;
  margin: 16px 0;

  &:not(:last-child) {
    border-right: 1px solid rgba(0, 22, 43, .1);
    padding-right: 16px;
  }

  &:last-child {
    padding-left: 16px;
  }
`

const StopName = styled.div`

`

const StopType = styled.div`
  font-size: 10px;
  line-height: 16px;
  font-weight: 700;
  letter-spacing: .05em;
`

const HoursColumns = styled.div`
  display: flex;
  padding: 16px 0 48px 0;
`

const HoursColumn = styled.div`
  width: 50%;
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  display: flex;
  justify-content: center;
`

const HoursList = styled.div`
  display: inline-block;
`

const Stop = styled.div`
  ${props => props.next && 'color: red;'}
`

const Line = styled.div`
  position: relative;
  width: 24vw;
  height: 1px;
  display: block;
  left: -12vw;
  top: 16px;
  margin: 0 0 31px 0;
  background-color: rgba(0, 22, 43, .2);
`

const Lines = styled.div`
  width: 0;
`

const hoursAndMinutesToMinutes = (hours, minutes) => ((hours * 60) + minutes)

const currentTimeToMinutes = hoursAndMinutesToMinutes(new Date().getHours(), new Date().getMinutes())

const linesList = firstStop.map((stop, index) => {
  return (
    <Line key={index} />
  )
})

class CompareStops extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dayType: 0,
      stopLeave: 0,
      stopArrive: 1
    }
    this.handleDayType = this.handleDayType.bind(this)
    this.handleStopArrive = this.handleStopArrive.bind(this)
    this.handleStopLeave = this.handleStopLeave.bind(this)
  }

  handleDayType (event) {
    this.setState({dayType: event.target.value})
  }

  handleStopLeave (event) {
    this.setState({stopLeave: event.target.value})
  }

  handleStopArrive (event) {
    this.setState({stopArrive: event.target.value})
  }

  render () {
    const firstStopInMinutes = e11[this.state.stopLeave].dayTypes[this.state.dayType].hours.map((stop) => {
      return hoursAndMinutesToMinutes(stop.hour, stop.minute)
    })

    var nextBusHourInMinutes = firstStopInMinutes.find(function (element) {
      return element > currentTimeToMinutes
    })

    const indexOfNextBusHourInMinutes = firstStopInMinutes.indexOf(nextBusHourInMinutes)
    const firstStopList = e11[this.state.stopLeave].dayTypes[this.state.dayType].hours.map((stop, index) => {
      const doubleDigitMinute = stop.minute === 0 ? `${stop.minute}0` : (stop.minute > 0 && stop.minute < 10) ? `0${stop.minute}` : stop.minute
      return (
        <Stop key={index} withLine next={index === indexOfNextBusHourInMinutes}>
          {stop.hour}
          :
          {doubleDigitMinute}
        </Stop>
      )
    })

    const secondStopList = e11[this.state.stopArrive].dayTypes[this.state.dayType].hours.map((stop, index) => {
      const doubleDigitMinute = stop.minute === 0 ? `${stop.minute}0` : (stop.minute > 0 && stop.minute < 10) ? `0${stop.minute}` : stop.minute
      return (
        <Stop key={index}>
          {stop.hour}
          :
          {doubleDigitMinute}
        </Stop>
      )
    })

    return (
      <Wrapper>
        <TopSection>
          <HeaderWrapper>
            <Header />
            <Select value={this.state.dayType} onChange={this.handleDayType}>
              <option value='0'>Días laborales</option>
              <option value='1'>Fin de semana</option>
            </Select>
          </HeaderWrapper>
          <StopsSection>
            <StopWrapper>
              <StopType>SALIDA</StopType>

              <Select value={this.state.stopLeave} onChange={this.handleStopLeave} fullWidth>
                <option value='0'>{e11[0].name}</option>
                <option value='1'>{e11[1].name}</option>
                <option value='2'>{e11[2].name}</option>
              </Select>
            </StopWrapper>
            <StopWrapper>
              <StopType>LLEGADA</StopType>

              <Select value={this.state.stopArrive} onChange={this.handleStopArrive} fullWidth>
                <option value='0'>{e11[0].name}</option>
                <option value='1'>{e11[1].name}</option>
                <option value='2'>{e11[2].name}</option>
              </Select>
            </StopWrapper>
          </StopsSection>
        </TopSection>

        <MainSection>
          <HoursColumns>
            <HoursColumn >
              <HoursList>
                {firstStopList}
              </HoursList>
            </HoursColumn>

            <Lines>
              {linesList}
            </Lines>

            <HoursColumn>
              <HoursList>
                {secondStopList}
              </HoursList>
            </HoursColumn>
          </HoursColumns>
        </MainSection>
      </Wrapper>
    )
  }
}

export default CompareStops

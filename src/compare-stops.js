import React, { Component } from 'react'
import styled from 'styled-components'
import Header from './header'
import { e11 } from './stops'
import caretDown from './caret-down.svg'
import arrowLg from './arrow-lg.svg'
import rootArrow from './root-arrow.svg'

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
  background-position: top 10px right;
  outline: 0;
`

const TopSection = styled.div`
  background-color: white;
  position: sticky;
  top: 0;
  padding: 16px 24px 0 24px;
  z-index: 1;

  &:after {
    content: '';
    display: block;
    height: 24px;
    width: 100%;
    left: 0;
    background: linear-gradient(rgba(240,241,242,1), rgba(240,241,242,0));
    position: absolute;
  }
`

const BottomShadow = styled.div`
  height: 24px;
  width: 100%;
  background: linear-gradient(rgba(240,241,242,0), rgba(240,241,242,1));
  position: sticky;
  bottom: 0;
`

const HeaderWrapper = styled.div`
  border-bottom: 1px solid rgba(0, 22, 43, .1);
  padding-bottom: 16px;
`

const StopsSection = styled.div`
  display: flex;
  align-items: center;
`

const StopWrapper = styled.div`
  width: 50%;
  margin: 16px 0;
`

const StopArrow = styled.div`
  margin-left: 20px;
  margin-right: 20px;
`

const ArrowlG = styled.img`
  
`

const RootArrow = styled.img`
  
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
  ${props => props.isNext && 'color: red;'}
`

const Line = styled.div`
  position: relative;
  width: 24vw;
  height: 15px;
  display: block;
  left: -12vw;
  top: 8px;
  margin: 0 0 17px 0;
  background-image: url(${rootArrow});
  background-repeat: no-repeat;
  background-position: center;
  opacity: .3;
`

const Lines = styled.div`
  width: 0;
`

const hoursAndMinutesToMinutes = (hours, minutes) => ((hours * 60) + minutes)

const currentTimeToMinutes = hoursAndMinutesToMinutes(new Date().getHours(), new Date().getMinutes())

const getDayType = () => {
  if (new Date().getDay() === 0) {
    return 1
  }
  if (new Date().getDay() < 5) {
    return 0
  }
  if (new Date().getDay() > 5) {
    return 1
  }
  return 0
}

const minuteToDoubleDigit = (minute) => {
  return minute === 0 ? `${minute}0` : (minute > 0 && minute < 10) ? `0${minute}` : minute
}

const stopsMap = e11.map(() => { return null })
const stopsAmount = stopsMap.length

class CompareStops extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dayType: getDayType(),
      stopLeave: 0,
      stopArrive: stopsAmount - 1
    }
    this.handleDayType = this.handleDayType.bind(this)
    this.handleStopArrive = this.handleStopArrive.bind(this)
    this.handleStopLeave = this.handleStopLeave.bind(this)
  }

  handleDayType (event) {
    this.setState({ dayType: event.target.value })
  }

  handleStopLeave (event) {
    this.setState({ stopLeave: event.target.value })
  }

  handleStopArrive (event) {
    this.setState({ stopArrive: event.target.value })
  }

  render () {
    const stopLeaveHours = e11[this.state.stopLeave].dayTypes[this.state.dayType].hours
    const stopArriveHours = e11[this.state.stopArrive].dayTypes[this.state.dayType].hours

    const firstStopInMinutes = stopLeaveHours.map((stop) => {
      return hoursAndMinutesToMinutes(stop.hour, stop.minute)
    })

    var nextBusHourInMinutes = firstStopInMinutes.find(function (element) {
      return element > currentTimeToMinutes
    })

    const indexOfNextBusHourInMinutes = firstStopInMinutes.indexOf(nextBusHourInMinutes)

    const firstStopList = stopLeaveHours.map((stop, index) => {
      return (
        <Stop key={index} isNext={index === indexOfNextBusHourInMinutes}>
          {stop.hour}:{minuteToDoubleDigit(stop.minute)}
        </Stop>
      )
    })

    const secondStopList = stopArriveHours.map((stop, index) => {
      return (
        <Stop key={index}>
          {stop.hour}:{minuteToDoubleDigit(stop.minute)}
        </Stop>
      )
    })

    const linesList = stopLeaveHours.map((stop, index) => {
      return (
        <Line key={index} />
      )
    })

    const leaveStopNames = e11.map((stop, index) => {
      return (
        <option key={index} value={index} disabled={index === (stopsAmount - 1)}>
          {stop.name}
        </option>
      )
    })

    const arriveStopNames = e11.map((stop, index) => {
      return (
        <option key={index} value={index} disabled={index <= this.state.stopLeave}>
          {stop.name}
        </option>
      )
    })

    return (
      <div>
        <TopSection>
          <HeaderWrapper>
            <Header />
            <Select value={this.state.dayType} onChange={this.handleDayType}>
              <option value='0'>Día laboral</option>
              <option value='1'>Fin de semana</option>
              <option value='2'>Día festivo</option>
            </Select>
          </HeaderWrapper>
          <StopsSection>
            <StopWrapper>
              <StopType>SALIDA</StopType>

              <Select value={this.state.stopLeave} onChange={this.handleStopLeave} fullWidth>
                {leaveStopNames}
              </Select>
            </StopWrapper>

            <StopArrow>
              <ArrowlG src={arrowLg} />
            </StopArrow>

            <StopWrapper>
              <StopType>LLEGADA</StopType>

              <Select value={this.state.stopArrive} onChange={this.handleStopArrive} fullWidth>
                {arriveStopNames}
              </Select>
            </StopWrapper>
          </StopsSection>
        </TopSection>

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
        <BottomShadow />
      </div>
    )
  }
}

export default CompareStops

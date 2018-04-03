import React from 'react'
import styled from 'styled-components'
import arrow from './arrow.svg'

const Arrow = styled.img`
  margin: 0 6px;
`

const Header = () => (
  <div>
    <div>
      Horario
    </div>
    <b>
      E11.1 Mataró
      <Arrow src={arrow} />
      Barcelona
    </b>
  </div>
)

export default Header

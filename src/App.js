import * as d3 from 'd3'
import { useState } from 'react'
import './App.css'

const width = 900
const height = 900
const padding = 50
const colors = [
  '#efc4d5',
  '#e2b6d7',
  '#d2a8d8',
  '#c29bda',
  '#b28ddb',
  '#b08edd',
  '#a280de',
  '#7f65df',
  '#7058e5',
  '#5f4ae6',
]

const createChart = async () => {
  const data = await d3.json('testdata.json')

  const sortedData = data.companies.sort((a, b) => b.turnover - a.turnover)

  // calculate max turnover value for normalizing
  const maxValue = sortedData[0].turnover

  // create color scale with as many values as there are colors
  const colorScale = d3
    .scaleOrdinal()
    .domain([...Array(colors.length).keys()])
    .range(colors)

  const pack = d3
    .pack()
    .size([width - padding, height - padding])
    .padding(5)

  const hierarchy = d3.hierarchy({ children: sortedData }).sum(d => d.turnover)

  const root = pack(hierarchy)

  const svg = d3.select('#chart').attr('width', width).attr('height', height)

  const bubbles = svg
    .selectAll('.bubble')
    .data(root.descendants().slice(1))
    .enter()
    .append('g')
    .attr('class', 'bubble')
    .attr('transform', d => `translate(${d.x + padding}, ${d.y + padding})`)

  // fill bubbles with normalized values of turnovers multiplied with number of colors
  // this will generate values from 0 to n of colors
  bubbles
    .append('circle')
    .attr('r', d => d.r)
    .attr('fill', d =>
      colorScale(Math.round((d.data.turnover / maxValue) * colors.length - 1))
    )

  bubbles
    .append('text')
    .style('text-anchor', 'middle')
    .append('tspan')
    .attr('class', 'name')
    .text(d => d.data.name)
    .append('tspan')
    .attr('class', 'turnover')
    .attr('x', 0)
    .attr('dy', '1.2em')
    .text(d => d.data.turnover)
}

function App() {
  const [showMenu, setShowMenu] = useState(false)
  createChart()
  return (
    <div className="App">
      <div className="container">
        <div className="bar">
          <h2>Bubble chart</h2>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="icon-button"
          >
            <span class="material-symbols-outlined">more_horiz</span>
            <div className={`dropdown ${showMenu && 'active'}`}>
              <div>
                <span class="material-symbols-outlined">edit</span>
                Muokkaa widgettiä
              </div>
              <div>
                <span class="material-symbols-outlined">content_copy</span>Luo
                kopio
              </div>
              <div>
                <span class="material-symbols-outlined">delete</span>Poista
              </div>
              <div>
                <span class="material-symbols-outlined">refresh</span>Lataa
                uudelleen
              </div>
              <div>
                <span class="material-symbols-outlined">upgrade</span>Vie
                widgetti tiedotoksi
              </div>
              <div>
                <span class="material-symbols-outlined">save</span>Tallenna...
              </div>
            </div>
          </button>
        </div>
        <svg id="chart" />
      </div>
    </div>
  )
}

export default App

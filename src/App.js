import './App.css'

function App() {
  const data = require('./data/testdata.json')

  return (
    <div className="App">
      {data.companies.map(m => (
        <p>{m.name}</p>
      ))}
    </div>
  )
}

export default App

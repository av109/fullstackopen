const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part name={props.part1} num={props.exercises1} />
      <Part name={props.part2} num={props.exercises2} />
      <Part name={props.part3} num={props.exercises3} />
    </div>
  )
}

const Total = (props) => {
  const total = props.a + props.b + props.c ;
  return (
    <div>
      <p>Number of exercises {total} </p>
    </div>
  )
}

const Part = (props) => {
  return (
    <>
      <p>{props.name} {props.num}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content part1={part1} exercises1={exercises1} part2={part2} exercises2={exercises2} part3={part3} exercises3={exercises3} />
      <Total a={exercises1} b={exercises2} c={exercises3}/>
    </div>
  )
}

export default App
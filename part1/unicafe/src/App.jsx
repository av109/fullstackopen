import { useState } from "react";

const Header = ({name}) =>{
  return <h1>{name}</h1>
}

const Button = ({ onclick, text }) => {
  return <button onClick={onclick}>{text}</button>;
};
const Statline = ({ text, value }) => {
  if(text == "Positive"){
    return (
      <tr>
        <td>{text}</td>
        <td>{value} %</td>
      </tr>
    )
  }
  else {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    )
  }
};

const Stats = ({ good, bad, neutral }) => {
  if ((good || bad || neutral) == 0) {
    return <p>No Votes FOund!!!</p>;
  } else {
    return (
      <>
        <table>
          <tbody>
          <Statline text="Good" value={good}/>
          <Statline text="Neutral" value={neutral}/>
          <Statline text="Bad" value={bad}/>
          <Statline text="Total" value={good + bad + neutral}/>
          <Statline text="Avg Score" value={Math.round((good + bad + neutral) / 3)}/>
          <Statline text="Positive" value={Math.round((good / (good + bad + neutral)) * 100)}/>
          </tbody>
        </table>
      </>
    );
  }
};

const App = () => {
  // save clicks of each button to its own state
  // const [good, setGood] = useState(0);
  // const [neutral, setNeutral] = useState(0);
  // const [bad, setBad] = useState(0);

  const [clicks, setClicks] = useState({
    good: 0, bad: 0, neutral: 0
  })

  const handleGood = () => {
    // setGood(good + 1);
    setClicks({...clicks, good: clicks.good+1})
  };
  const handleNeutal = () => {
    // setNeutral(neutral + 1);
    setClicks({...clicks, neutral: clicks.neutral+1})

  };
  const handleBad = () => {
    // setBad(bad + 1);
    setClicks({...clicks, bad: clicks.bad+1})

  };

  return (
    <div>
      <Header name="Customer Feedback"/>
      <Button onclick={handleGood} text="Good" />
      <Button onclick={handleNeutal} text="Neutral" />
      <Button onclick={handleBad} text="Bad" />
      <Header name="Stats"/>
      <Stats good={clicks.good} bad={clicks.bad} neutral={clicks.neutral} />
    </div>
  );
};

export default App;

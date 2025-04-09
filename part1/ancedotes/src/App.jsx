import { useState } from "react";
const Anecdote = ({text, votesCount}) =>
  <div>
    <p>{text}</p>
    <p>has {votesCount} votes</p>
  </div>

const WinAne = ({winnertext, winnervotes}) =>{
  if(winnervotes == 0){
    return null;
  }
  return (
    <div>
      <h2>Anecdote with most number of votes.</h2>
      <p>{winnertext}</p>
      <p>and it has {winnervotes} votes</p>
    </div>
  )
}
const App = () => {
  const [selected, setSelected] = useState(0);
  const [allVotes, setAllVotes] = useState(Array(8).fill(0));

  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  
  const max = anecdotes.length;
  function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
  }

  const handleRandom = () => {
    setSelected(getRandomIntInclusive(0, max - 1));
  };

  const handleVote = () => {
    const newAllVotes = [...allVotes]
    newAllVotes[selected] += 1
    setAllVotes(newAllVotes)
  }

  let winner = allVotes.indexOf(Math.max(...allVotes));


  return (
    <div>
      <Anecdote text={anecdotes[selected]} votesCount={allVotes[selected]} />
      <button onClick={handleVote}>Vote</button>
      <button onClick={handleRandom}>Random</button>
      <WinAne winnertext={anecdotes[winner]} winnervotes={allVotes[winner]}/>

      
    </div>
  );
};

export default App;

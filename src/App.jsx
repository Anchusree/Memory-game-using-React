import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import Confetti from 'react-confetti'

const gameIcons = ["A","B","C","D","E","F"]

function App() {

  const [pieces,setPieces] = useState([])
  const [score,setScore] = useState(0)
  const [hintCounter, setHintCounter] = useState(3);
  const [moves,setMoves] = useState(0)
 

  let timeout = useRef()
  const isGameCompleted = useMemo(()=>{
    if(pieces.length > 0 && pieces.every((piece=>piece.solved))){
      return true;
    }
    return false
  }
  ,[pieces])

  const startGame = ()=>{
    const duplicateGameIcons = gameIcons.concat(gameIcons)
    const newGameIcons = []
    while(newGameIcons.length < gameIcons.length * 2){
      const randomIndex = Math.floor(Math.random()* duplicateGameIcons.length)
      newGameIcons.push({
        letter: duplicateGameIcons[randomIndex],
        flipped:false,
        solved:false,
        position:newGameIcons.length
      })
      duplicateGameIcons.splice(randomIndex,1)
    }
    setPieces(newGameIcons)
  }

  useEffect(()=>{
    startGame()
  },[])

  const handleActive =(data)=>{
    const flippedData = pieces.filter(data=>data.flipped&& !data.solved)
    if(flippedData.length === 2) return;

    const newPieces = pieces.map((piece)=>{
      if(piece.position === data.position){
        piece.flipped = !piece.flipped
      }
      return piece
    });
    setPieces(newPieces)
    setMoves((prevMoves) => prevMoves + 1);
  };

  const gameLogicForFlipped = ()=>{
    const flippedData = pieces.filter(data=>data.flipped && !data.solved)
    if(flippedData.length === 2){
      timeout.current = setTimeout(() => {

        setPieces(pieces.map(data=>{
          if(data.position === flippedData[0].position || data.position === flippedData[1].position ){
            
            if(flippedData[0].letter === flippedData[1].letter){
              data.solved = true
              setScore(score+10)
            }
            else{
              data.flipped = false
              if(score > 0){
                setScore(score-5)
              }
            }
          }
          return data;
        }
        ))
      }, 800);
    }
    else if (flippedData.length === 1 && hintCounter < 3) {
      timeout.current = setTimeout(() => {
        setPieces(
          pieces.map((data) => {
            if (data.position === flippedData[0].position) {
              data.flipped = false;
            }
            return data;
          })
        );
      }, 800);
    }
  }



  useEffect(()=>{
    gameLogicForFlipped()
    return ()=>clearTimeout(timeout.current)
  },[pieces])

  const handleHint = (data) => {
    if (hintCounter > 0) {
      const unFlippedCards = data.filter(data=>!data.flipped && !data.solved)
      if (unFlippedCards.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * unFlippedCards.length
        );
        const cardToReveal = unFlippedCards[randomIndex];
        const newPieces = [...pieces];
        newPieces[cardToReveal.position].flipped = true;
        setPieces(newPieces);
        setHintCounter(hintCounter - 1);
      }
    }
  };

  return (
    <>
     <main>
      <h1>Memory Game</h1>
      <div className='scorecontent'>
        <h2>Score: {score}</h2>
        <button
          className="hint-button"
          onClick={()=>handleHint(pieces)}
          disabled={hintCounter === 0}
        >
          Hint
        </button>
      </div>
     

     
      
      <div className='container'>
        {
          pieces.map((data,index)=>(
            <div className={`flip-card ${data.flipped ? "active":""}`} key={index} 
            onClick={()=> handleActive(data)}>
              <div className="flip-card-inner">
                <div className="flip-card-front"></div>
                <div className="flip-card-back">{data.letter}</div>
              </div>
            </div>
          ))
        }
       <div className="hint-counter">Hints Remaining: {hintCounter}</div>
      </div>
      {isGameCompleted && 
      <div className='game-completed'>
        {
          score >=45
          ?
          <>
          <h1>YOU WIN!!!<br/>
          Your Score is {score}<br/>
          No. of Moves: {moves}
          </h1>
          <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          />
          </>
          :
          <>
          <h1>OOPS!! YOU LOSE!!!<br/>Your Score is {score}</h1>
          </>
          
        }
       
      </div>
      }
      
     </main>
    </>
  )
}

export default App

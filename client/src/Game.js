import React, {useState, useEffect, useLayoutEffect, useCallback, useRef} from 'react';
import axios from 'axios';
//te
function Game() {
  //
  const exampleInp = useRef(null);
  const hiddenInp = useRef(null);
  //
  const API_URL = 'http://localhost:5000'

  const noStyle = {

  }

  const redStyle = {
    backgroundColor: '#f00'
  }

  const greenStyle = {
    backgroundColor: 'green'
  }

  const youKnowStyle = {
    backgroundColor: 'darkgreen'
  }

  //states

  const [valueExample, setValueExample] = useState('');

  const [userData, setUserData] = useState({id: false, token: false})
  const [question, setQuestion] = useState(null);
  const [idQuestion, setIdQuestion] = useState(null);
  const [props, setProps] = useState([]);

  const [blockTheKeyPress, setBlockTheKeyPress] = useState(null)

  const [iWantToAddExample, setIWantToAddExample] = useState(false)
  const [iWillAnswer, setIwillAnswer] = useState(false);
  const [iChoose, setIChoose] = useState(null);
  const [theAnswerIsCorrect, setTheAnswerIsCorrect] = useState(null);

  const [getTheAnswer, setGetTheAnswer] = useState(null);
  const [theAnswerIs, setTheAnswerIs] = useState(null);
  const [theLastGotId, setTheLastGotId] = useState(null);
  const [important, setImportant] = useState(0);
  const [statics, setStatics] = useState({t_times: 0, f_times: 0, n_times: 0});
  const [youKnowThis, setYouKnowThis] = useState(false);
  
  const [theListOfExamples, setTheListOfExamples] = useState([]);
  const [getTheListOfExamples, setGetTheListOfExamples] = useState(false);

  const [increment, setIncrement] = useState(0);
  //Check user Data

  useEffect(() => {
    
    if(5 === 6 ) {
      let id = localStorage.getItem('fc_id');
      let token = localStorage.getItem('fc_token');
  
      if(!id || !token || id === 'undefined'){
  
        axios.get(`${API_URL}/newuser`)
        .then((data) => {
          console.log(data)
          setUserData({
            id: data.data._id,
            token: data.data.token,
          })
  
          localStorage.setItem('fc_id', data.data._id);
          localStorage.setItem('fc_token', data.data.token);
        })
        .catch((err) => console.log(err))
  
      } else {
  
        setUserData({
          id,
          token
        });
  
      }
    }

    setUserData({
      id: true,
      token: true,
    })

  }, []);



  //axios funcion
  //Get axios
  let get = useCallback(() => {

    setIwillAnswer(false);
    setGetTheAnswer(false);

    axios.get(`${API_URL}`)
    .then(res => {
      if(res && res.data){
        let quiz = res.data;
        setIChoose(null);
        setQuestion(quiz.question);
        setIdQuestion(quiz.id);
        setProps(quiz.props);
        setStatics({
          t_times: quiz.t_times || 0,
          f_times: quiz.f_times || 0,
          n_times: quiz.n_times || 0,
        });
        setYouKnowThis((quiz.t_times - 3*quiz.f_times >= 3) ? true : false);
        let imp = (quiz.important > 3000) ? 100 : Math.floor(+quiz.important/30);
        setImportant(imp);
      }
    }).catch((err) => console.log(err))

  }, []);

  //Post axios
  let post = useCallback((dataSend) => {
    axios.post(`${API_URL}`, dataSend)
    .then(res => {
      if(res && res.data){
        let correct = res.data;
        if(correct.answer) {
          setTheAnswerIsCorrect(true)
          setIChoose(dataSend.token);

        } else {
          setTheAnswerIsCorrect(false)
          setIChoose(dataSend.token);

        }
      }
    }).catch((err) => console.log(err))

  }, []);

  //The put
  let thePut = useCallback((dataSend) => {
    

    axios.put(`${API_URL}`, dataSend)
    .then(res => {
      console.log(res.data);
    }).catch((err) => console.log(err))
    

  }, []);

  const allFalse = () => {
    setIWantToAddExample(false);
    setIwillAnswer(false);
    setTheAnswerIs(false);
    setGetTheListOfExamples(false);


  }

  //Get the examples

  let getTheExamples = useCallback((id) => {

    axios.get(`${API_URL}/examples/${id}`)
    .then(res => {
      if(res) {
        if(res.data.examples) {
          setTheListOfExamples(res.data.examples);
        }
      }
    }).catch((err) => console.log(err))

  }, []);


  //I know

  //Get correct answer - axios
  let getAnswer = useCallback((id) => {

    axios.get(`${API_URL}/getanswer/${id}`)
    .then(res => {
      if(res && res.data){
        setTheAnswerIs(res.data.correct_token);
      }
    }).catch((err) => console.log(err))

  }, []);



  useEffect(() => {
    get();
  }, [get]);



  const sendExample = (e) => {
    e = e || window.event;
    e.preventDefault();
    
    thePut({id: idQuestion, example: valueExample});
    setValueExample('');

    allFalse();

  }

  const changeExample = (e) => {
    e = e || window.event;
    setValueExample(e.target.value);
  }


  const press = useCallback((e) => {
    e = e || window.event;
    let key = e, press = false;
    if(e > 0) {
      if(e !== 32) {
        setIncrement(i => i+1);
      }
    } else {
      key = e.keyCode;
      press = true;
    }

    if(blockTheKeyPress && press) {
      
    } else {
      
      console.log(key);
  
      if(key === 16) {
        allFalse();
        setGetTheAnswer(true);
      }
  
      if(key === 13){ //The next
        allFalse();
        get();
      }else if (key === 107) { //+
        allFalse()
        thePut({id: idQuestion, t_times: true})
        get();
  
      } else if(key === 32) { //space: add an example
  
        setIWantToAddExample(true);
  
      } else if (key === 109) { //-
        //We need to add one - put axios
        allFalse()
        thePut({id: idQuestion, f_times: true})
        get();
  
      } else if(key === 96) {
        setGetTheListOfExamples(true);
      }else if(key === 106){
        allFalse()
        thePut({id: idQuestion, i_use_this: true})
        get();
      }else if(key === 110) { //.
        allFalse();
        setIwillAnswer(true);
      }
    }

  }, [get, thePut, idQuestion, blockTheKeyPress])

  useEffect(() => {

    window.addEventListener('keyup', press);

    return () => {
      window.removeEventListener('keyup', press)
    }
  }, [press])

  useEffect(() => {
    
    if(getTheAnswer && theLastGotId !== idQuestion) {
      allFalse()
      getAnswer(idQuestion);
      setTheLastGotId(idQuestion);
      setGetTheAnswer(false);
    } else if(getTheAnswer && theLastGotId === idQuestion) {
      allFalse()
      setTheAnswerIs(true);

    }

  }, [getTheAnswer, idQuestion, theLastGotId, getAnswer])


  useEffect(() => {
    if(getTheListOfExamples) {
      getTheExamples(idQuestion);
    }
  }, [getTheExamples, getTheListOfExamples, idQuestion]);

  useLayoutEffect(() => {
    
    if(iWantToAddExample) {
      if(exampleInp && exampleInp.current) exampleInp.current.focus();
      setBlockTheKeyPress(true);
    } else {
      setBlockTheKeyPress(false);
    }

  }, [iWantToAddExample])

  //

  useLayoutEffect(() => {
    if(increment > 0) {
      hiddenInp.current.focus();

    }
  }, [increment])

  //function

  const answer = (iChoose, id, token) => {
    if(!iChoose) {
      
      let dataSend = {
        id,
        token
      }
  
      post(dataSend);
    }
  }


  return (
    <div className="app">
      <div className="inf">
        <div className="important">
          <div className="important-full" style={{width: important+'%'}}></div>
          <span className="important-span">{important+'%'}</span>
        </div>
        {/* You kwon this word */
          (youKnowThis) ?

          <div className="you-kwon">
          &#10003; Good, you know this word &#10003;
          </div>

          : ''
        }
        
        <div className="inf-num">
          <div className="inf-num-all">{statics.n_times +1}</div>
          <div className="inf-num-incorrect">{statics.f_times}</div>
          <div className="inf-num-correct">{statics.t_times}</div>
        </div>

      </div>
      <input ref={hiddenInp} className="hiddenInput"/>
      <div className="question" style={(youKnowThis) ? youKnowStyle : noStyle}>{(youKnowThis ? <span>&#10003; {question} &#10003;</span> : question)}</div>
      
      <div className="main">


        {
          (getTheListOfExamples) ?
            <div className="examples-list">
              {
                (theListOfExamples.length === 0 ?
                  <div>There is no example</div> :
                  theListOfExamples.map((el, key) => {
                    return <div key={key}>{el}</div>
                  })
                )
              }
            </div>

          :(iWantToAddExample) ?
        
          <form onSubmit={() => sendExample()} className="i-want-to-answer">
            <textarea ref={exampleInp} value={valueExample} onChange={changeExample}>
                
            </textarea>
            <button>Send</button>
          </form>
          
          :(theAnswerIs) ? 
          <div className="the_correct">
            {props.filter((el) => el.token === theAnswerIs).map((el, key) => {
              return <div key={key}>{el.text}</div>
            })}
          </div> : iWillAnswer ?
        <ul className="props">
          {props.map((el) => {
            return <li className="item" onClick={() => answer(iChoose, idQuestion, el.token)}
                        key={el.token} style={(!iChoose) ? noStyle : (theAnswerIsCorrect && iChoose === el.token) ? greenStyle : (!theAnswerIsCorrect && iChoose === el.token) ? redStyle : noStyle}>
              {el.text}
              </li>

          })}
        </ul>
        : ''
        }
      </div>

      <div className="buttons">
        <button onClick={() => press(16)}>The answer <br /> (shift)</button>
        <button>Add image <br /> (i)</button>
        <button onClick={() => press(32)}>Add example <br /> (space)</button>
        <button onClick={() => press(96)}>List of examples <br /> (0)</button>
        <button onClick={() => press(109)}>I don't kwon <br /> (-)</button>
        <button onClick={() => press(107)}>I kwon <br /> (+)</button>
        <button onClick={() => press(13)}>Next <br /> (enter)</button>
        <button onClick={() => press(110)}>quiz <br /> ( point )</button>
        <button onClick={() => press(106)}>I use this <br /> ( * )</button>
      </div>
    </div>
  );
}

export default Game;

import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function Inf() {
    const API_URL = 'http://localhost:5000'

    const t0 = {
        review: false,
        seen: false,
        know: false,
        finish: false,
        all: false
    }

    const [getThis, setGetThis] = useState({
        review: false,
        seen: false,
        know: false,
        finish: false,
        all: false
    });

    const [infData, setInfData] = useState({
        review: false,
        seen: false,
        know: false,
        finish: false,
        all: false
    });

    const [details, setDetails] = useState([]);
    const [examples, setExamples] = useState([]);

    const chooseThis = (title) => {

        let t = t0;
        t[title] = true;

        setGetThis(t);
        
    }

    useEffect(() => {

        axios.post(`${API_URL}/moreinf`, getThis)
        .then((data) => {
            if(data && data.data) {
                if(data.data.length > 0) {
                    setDetails(data.data.reverse());
                } else {
                    setDetails([]);
                }
            }
        })
        .catch((err) => console.log(err))

    }, [getThis])


    useEffect(() => {

          
        axios.get(`${API_URL}/inf`)
        .then((data) => {
            if(data && data.data) setInfData(data.data);
        })
        .catch((err) => console.log(err))

    }, []);
    
    const showExamples = (ex) => {
        setExamples(ex);
    }

    return (
        <div className="more-inf">
            <div className="more-inf-content">
                <ul className="all-inf-links">
                    <li onClick={() => chooseThis('review')}>You have to use ({infData.know - infData.finish})</li>
                    <li onClick={() => chooseThis('finish')}>finish ({infData.finish})</li>
                    <li onClick={() => chooseThis('know')}>know ({infData.know})</li>
                    <li onClick={() => chooseThis('seen')}>seen ({infData.seen})</li>
                    <li onClick={() => chooseThis('all')}>all ({infData.all})</li>
                </ul>
            </div>
            <div className="details">
                {(details.length === 0) ? '' :
                    details.map((el) => {
                        let important = (el.important > 3000) ? 100 : Math.floor(+el.important/30);
                        return <div onClick={() => showExamples(el.example)} key={el._id}>
                            <div className="word-det">
                                {el.en_word} {(el.example.length > 0) ? '(*)' : ''}
                            </div>
                            <div>
                                <div className="imp-det">
                                    {important+'%'}
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>

            {(examples.length > 0) ?
                <div className="examples">  
                    {examples.map((el, key) => {
                        return <div key={key}>{el}</div>
                    })}
                </div>
                : ''}
        </div>
    )
}

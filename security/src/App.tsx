import { useEffect, useState } from "react";

function App() {
    const [name, setName] = useState('');
    const [response, setResponse] = useState('');
    const initialText = "<img src='x' onError='alert(\"XSS Napad!\")'/>";
    const [hint, setHint] = useState('');
    const [xss, setXss] = useState(true);
    const [accountName, setAccountName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [accountNumber, setAccountNumber] = useState('');
    const [tempId, setTempId] = useState('');
    const [bda, setBda] = useState(false);
    const URL = "https://security-no4s.onrender.com"
    const port = "443"


    const handleChange = (e:any) => {
        setName(e.target.value);
    };

    const changeHint = () => {
        setHint(initialText);
    };

    const handleAccountNameChange = (event:any) => {
        setAccountName(event.target.value);
    }

    const handleSubmit = async (event:any) => {
        event.preventDefault();
        try {
            const encodedName:string = xss ? name : encodeURIComponent(name);
            const path:string = xss ? 'helloBad' : 'helloStrong'
            const res = await fetch(`${URL}:${port}/${path}?name=${encodedName}`);
            const text = await res.text();
            setResponse(text);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        changeHint();
    }, []);

    function handleXssToggle() {
        setXss(!xss);
    }

    const handleBDASubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (bda) {
                setLoggedIn(true);
                const accName: string = accountName;
                const res = await fetch(`${URL}:${port}/accountInfo?accname=${accName}`)
                const text = await res.json();
                setAccountNumber(text.accNumber);
            } else {
                setLoggedIn(true);
                const accName = accountName;
                const res = await fetch(`${URL}:${port}/generateTempId?accname=${accName}`);
                const data = await res.json();
                setTempId(data.tempId);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    function handleBdaToggle() {
        setBda(!bda)
    }

    return (
        <div>
            <h1>Type your name (XSS Attack)</h1>
            <label>
                <input
                    type="checkbox"
                    checked={xss}
                    onChange={handleXssToggle}
                />
                Enable XSS attack
            </label>
            <p>Hint: {hint}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={handleChange}
                    placeholder="Type your name"
                />
                <button type="submit">Hello</button>
            </form>
            <div dangerouslySetInnerHTML={{__html: response}}/>
            <h1>
                Bad Access Control
            </h1>
            <label>
                <input
                    type="checkbox"
                    checked={bda}
                    onChange={handleBdaToggle}
                />
                Enable BDA attack
            </label>
            <p>Hint: your name is Alice</p>
            <form onSubmit={handleBDASubmit}>
                <input
                    type="text"
                    value={accountName}
                    onChange={handleAccountNameChange}
                    placeholder="Type your name"
                />
                <button type="submit">Get Account ID</button>
            </form>
            {loggedIn && tempId && !bda && (
                <div>
                    <h2>Welcome, {accountName}!</h2>
                    <p>Your temporary ID is: {tempId}</p>
                    <a href={`${URL}:${port}/user?tempId=${tempId}`}>
                        Visit balance sheet
                    </a>
                </div>
            )}
            {loggedIn && bda &&(
                <div>
                    <h2>Welcome, {accountName}!</h2>
                    <p>Your account number is: {accountNumber}</p>
                    <p>Hint: access control is not very good, try increasing or decreasing the account number in the URL</p>
                    <a href={`${URL}:${port}/userWeak?accnum=` + accountNumber}>
                        Visit balance sheet
                    </a>
                </div>
            )}
        </div>

    );
}

export default App;



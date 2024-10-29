import { useEffect, useState } from "react";

function App() {
    const [name, setName] = useState('');
    const [response, setResponse] = useState('');
    const initialText = "<img src='x' onError='alert(\"XSS Napad!\")'/>";
    const [hint, setHint] = useState('');
    const [xss, setXss] = useState(true);
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');


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
            console.log(encodedName);
            const res = await fetch(`http://localhost:8080/${path}?name=${encodedName}`);
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

    async function viewBalance(accountNumber: string) {
        try {
            const res = await fetch(`http://localhost:8080/user?accnum=${accountNumber}`, {
                method: 'GET'
            });


            // Wait for the JSON response
            const info = await res.json();
            console.log(info); // Now this will log the actual response data
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }

    const handleBDASubmit = async (event: any) => {
        event.preventDefault();
        try {
            const accName: string = accountName;
            const res = await fetch(`http://localhost:8080/accountInfo?accname=${accName}`)
            const text = await res.json(); // Assuming the response is JSON
            setAccountNumber(text.accNumber); // Set the account number state
            console.log(accountNumber); // Log the whole response to see what you're getting
            return viewBalance(accountNumber)
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
                    placeholder="input your name"
                />
                <button type="submit">Hello</button>
            </form>
            <div dangerouslySetInnerHTML={{__html: response}}/>
            <h1>
                Bad Access Control
            </h1>
            <form onSubmit={handleBDASubmit}>
                <input
                    type="text"
                    value={accountName}
                    onChange={handleAccountNameChange}
                    placeholder="Type your name"
                />
                <button type="submit">Submit</button>
            </form>
        </div>

    );
}

export default App;

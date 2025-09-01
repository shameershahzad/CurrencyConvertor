import React, { useState, useEffect } from 'react';
import './InputBox.css';

function InputBox() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState("PKR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState("");
  const [exchangeRate, setExchangeRate] = useState({});

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await fetch("https://api.currencyapi.com/v3/latest?apikey=cur_live_quGT5J77xotqOoRNtx65iTuunTAKrlpVjeGJi7Op");
        if (!res.ok) {
          throw new Error("Network error: Unable to fetch exchange rates");
        }
        const result = await res.json();
        console.log(result)
        if (result.data) {
          setCurrencies(Object.keys(result.data));
          setExchangeRate(result.data);
        }
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };
    fetchApi();
  }, []);

  const handleConvert = () => {
    if (exchangeRate[fromCurrency] && exchangeRate[toCurrency]) {
      const rate = exchangeRate[toCurrency].value / exchangeRate[fromCurrency].value;
      setConvertedAmount(amount * rate);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount || amount);
    setConvertedAmount(amount);
  };

  return (
    <>
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
      <h1 style={{ textAlign: "center", fontSize: "50px", color: "pink" }}>Currency Converter</h1>
      <div className="converter-container" style={{
        height: "320px", width: "450px", border: "2px solid rgba(255, 255, 255, 0.1)",
        marginLeft: "33%", marginTop: "80px", borderRadius: "15px", background: "rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 45px rgba(0, 0, 0, 0.2)"
      }}>
        {/* Input Section */}
        <div>
          <div style={{
            display: "flex", height: "90px", width: "400px", marginLeft: "27px", marginTop: "30px",
            borderRadius: "15px", backgroundColor: "white"
          }}>
            <div style={{ margin: "5px", width: "200px", paddingTop: "7px" }}>
              <label style={{ fontSize: "18px", marginLeft: "20px", color: "gray" }}>From</label>
              <br />
              <input
                style={{ marginLeft: "20px", height: "30px", marginTop: "5px",
                   width: "150px", outline: "none",border:"1px solid gray",borderRadius:"10px" }}
                type="tel"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div style={{ margin: "5px", width: "200px", display: "flex", flexDirection: "column" }}>
              <label style={{ marginTop: "8px", marginLeft: "69px", color: "gray", fontSize: "18px" }}>Currency Type</label>
              <select
                style={{ marginTop: "4px", marginLeft: "90px", height: "30px", width: "70px", borderRadius: "10px" }}
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <button
          className="swap-btn"
          style={{
            position: "absolute", top: "50%", left: "45%", transform: "translate(80%, -105%)",
            backgroundColor: "rgb(32, 197, 120)", color: "white", padding: "10px 20px",
            border: "none", borderRadius: "4px", alignSelf: "center", cursor: "pointer"
          }}
          onClick={handleSwap}
        >
          Swap
        </button>

        {/* Output Section */}
        <div>
          <div style={{
            display: "flex", height: "90px", width: "400px", marginLeft: "27px", marginTop: "16px",
            borderRadius: "15px", backgroundColor: "white"
          }}>
            <div style={{ margin: "5px", width: "200px", paddingTop: "7px" }}>
              <label style={{ fontSize: "18px", marginLeft: "20px", color: "gray" }}>To</label>
              <br />
              <input
                style={{ marginLeft: "20px", height: "30px", marginTop: "12px", border: "1px solid gray",
                   width: "150px", outline: "none" , borderRadius:"10px" }}
                type="tel"
                value={convertedAmount}
                readOnly
              />
            </div>
            <div style={{ margin: "5px", width: "200px", display: "flex", flexDirection: "column" }}>
              <label style={{ marginTop: "8px", marginLeft: "69px", color: "gray", fontSize: "18px" }}>Currency Type</label>
              <select
                style={{ marginTop: "4px", marginLeft: "90px", height: "30px", width: "70px", borderRadius: "10px" }}
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Convert Button */}
        <button
          className="convert-btn"
          style={{
            height: "48px", width: "400px", marginLeft: "27px", marginTop: "25px", border: "none",
            backgroundColor: "rgb(32, 197, 120)", fontSize: "20px", color: "white",
            borderRadius: "15px", cursor: "pointer"
          }}
          onClick={handleConvert}
        >
          Convert {fromCurrency} to {toCurrency}
        </button>
      </div>
    </>
  );
}

export default InputBox;

import React, { useEffect, useState } from 'react';
import './Auction.css';
import axios from 'axios';
import console from './lib/console-browserify';
import { Link } from 'react-router-dom';

function Auction() {
  const [imageURL, setImageURL] = useState('');
  const [maxBid, setMaxBid] = useState('');
  const [balance, setBalance] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [walletAddressInput, setWalletAddressInput] = useState('');
  const [bidAmountInput, setBidAmountInput] = useState('');


  useEffect(() => {
    const fetchImage = async () => {
      try {
        const responseImage = await axios.post('https://api.defender.openzeppelin.com/autotasks/d1c6bf30-0112-43a9-9352-bc978df633ab/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/LT7R5XRK72KshopDm25Cos');
        const resultImage = JSON.parse(responseImage.data.result);
        const url = JSON.parse(resultImage.body.message);
        const responseIpfs = await axios.get(url);
        const image_url = responseIpfs.data.image;
        const trimmedString = image_url.split('://')[1];
        const concatenatedUrl = "https://ipfs.io/ipfs/" + trimmedString;
        setImageURL(concatenatedUrl);
      } catch (error) {
        console.error('Error getting image:', error);
      }
    };

    const fetchBalance = async () => {
      try {
        const responseBalance = await axios.post('https://api.defender.openzeppelin.com/autotasks/413508e9-ac94-4fd1-ab16-01ce2c0d5cc5/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/a4kfQerDazMhW6BQTEg95', {
          accountAddress: "0xd592673053a14308C376D0125133A6770c52e6e5",
        });
        let balance = JSON.parse(responseBalance.data.result).hex;
        setBalance(parseInt(balance));
      } catch (error) {
        console.error('Error getting image:', error);
      }
    };

    const fetchMaxBid = async () => {
      try {
        const responseMaxBid = await axios.post('https://api.defender.openzeppelin.com/autotasks/53727e70-9b63-4c3f-b08f-df347928bea7/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/MC9XoNL6zhuqeW5fTKFR4p');
        console.log(responseMaxBid);
        const resultMaxBid = JSON.parse(responseMaxBid.data.result);
        const MaxbidObject = JSON.parse(resultMaxBid.body.message);
        console.log(MaxbidObject);
        setMaxBid(parseInt(MaxbidObject.hex));
      } catch (error) {
        console.error('Error getting bid:', error);
      }
    };


    const fetchTimeRemaining = async () => {
      try {
        const responseTimeRemaining = await axios.post('https://api.defender.openzeppelin.com/autotasks/905d76ac-2654-4644-a4d2-c2161c874d90/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/N2nLiRDP9eBmzzi3C5TvEc');
        console.log(responseTimeRemaining);
        const resultTimeRemainig = JSON.parse(responseTimeRemaining.data.result);
        const timeRemainingObject = JSON.parse(resultTimeRemainig.body.message);
        console.log(timeRemainingObject);
        setTimeRemaining(parseInt(timeRemainingObject.hex));
        console.log("TIEMPO", timeRemaining);
      } catch (error) {
        console.error('Error getting bid:', error);
      }
    };

    fetchBalance();
    fetchTimeRemaining();
    fetchImage();
    fetchMaxBid();
  }, [bidAmountInput]);

  const handleAddressChange = (event) => {
    setWalletAddressInput(event.target.value);
  };

  const handleBidChange = (event) => {
    setBidAmountInput(event.target.value);
  };

  const handleBid = () => {
    // Obtener los valores ingresados
    const walletAddress = walletAddressInput;
    const bidAmount = bidAmountInput;
    console.log("I BID");
    console.log(walletAddress);
    console.log(bidAmount);
    // Realizar operaciones con los valores
    // ...

    // Ejecutar otras funciones o acciones necesarias
    // ...
  };


  return (
    <div className="auction-page">
      <div className="titleAuction">
        <span className="title-textAuction">Auction</span>
      </div>

      <div className="image-container-auction">
        {imageURL && <img src={imageURL} alt="Imagen" />}
      </div>

      <div className="max-bidder-display">
        MAX BID:
        {maxBid && <span className="max-bidder">{maxBid}</span>}
      </div>

      <div className="time-remaining-display">
        TIME REMAINING:
        {timeRemaining && <span className="max-bidder">{timeRemaining}</span>}
      </div>

      <div className="balance-display">
        BALANCE:
        {balance && <span className="max-bidder">{balance}</span>}
      </div>

      <div className="input-container">
        {/* Add a container for the address input field */}
        <input
          value={walletAddressInput}
          onChange={handleAddressChange}
          className="input-field"
          placeholder="Wallet Address"
        />
      </div>
      <div className="input-container">
        {/* Add a container for the address input field */}
        <input
          value={bidAmountInput}
          onChange={handleBidChange}
          className="input-field"
          placeholder="Bid Amount"
        />
      </div>

      <div className="button-container">
        <button className="big-button" onClick={handleBid}>
          Bid
        </button>
      </div>

      <div className="button-container">
        <Link to="..">
          <button className="custom-button">Back</button>
        </Link>
      </div>
    </div>
  );
}

export default Auction;

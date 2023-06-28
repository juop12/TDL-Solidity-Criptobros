import React, { useEffect, useState } from 'react';
import './Auction.css';
import axios from 'axios';
import console from './lib/console-browserify';
import { Link } from 'react-router-dom';

function Auction() {
  const [address, setAddress] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [maxBid, setMaxBid] = useState('');
  const [bid, setBid] = useState('');
  const [balance, setBalance] = useState('');

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

    const fetchMaxBid = async () => {
      try {
        const responseMaxBid = await axios.post('https://api.defender.openzeppelin.com/autotasks/53727e70-9b63-4c3f-b08f-df347928bea7/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/MC9XoNL6zhuqeW5fTKFR4p');
        console.log(responseMaxBid);
        const resultMaxBid = JSON.parse(responseMaxBid.data.result);
        const MaxbidObject = JSON.parse(resultMaxBid.body.message);
        setMaxBid(JSON.stringify(MaxbidObject));
      } catch (error) {
        console.error('Error getting bid:', error);
      }
    };
    

    fetchImage();
    fetchMaxBid();
  }, [bid]);

  const handleAddressChange = async (event) => {
    setAddress(event.target.value);
    // se puede hacer con un useEffect también, da igual. PD: en un caso hipotetico habria que chequear los llamados a los webhooks
    // porque se hacen demasiados llamados si es uno por cada modificación en los campos :D, no nos importa para el scope del tp igual.
    try {
      const response = await axios.post('https://api.defender.openzeppelin.com/autotasks/413508e9-ac94-4fd1-ab16-01ce2c0d5cc5/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/a4kfQerDazMhW6BQTEg95', {
        accountAddress: address,
      })
      setBalance(parseInt(JSON.parse(response.data.result).hex));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  const handleBidChange = (event) => {
    setBid(event.target.value);
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

      <div className="balance-display">
        BALANCE:
        {balance && <span className="max-bidder">{balance}</span>}
      </div>

      <div className="input-container">
        {/* Add a container for the address input field */}
        <input
          value={address}
          onChange={handleAddressChange}
          className="input-field"
          placeholder="Wallet Address"
        />
      </div>
      <div className="input-container">
        {/* Add a container for the address input field */}
        <input
          value={bid}
          onChange={handleBidChange}
          className="input-field"
          placeholder="Bid Amount"
        />
      </div>

      <div className="button-container">
        <button className="big-button">
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

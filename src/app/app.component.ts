import { Component } from '@angular/core';
// @ts-ignore
import Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json';
import {ethers} from 'ethers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-ethereum';
  // Contract Address
  greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  greeting: any = '';

  constructor() {
    console.log('Greeter ABI: ', Greeter.abi);
  }

  async requestAccount() {
    // @ts-ignore
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async fetchGreeting() {
    // @ts-ignore
    if (typeof window.ethereum !== 'undefined') {
      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(this.greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        console.log('data: ', data);
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  // call the smart contract, send an update
  async setGreeting() {
    if (!this.greeting) { return; }
    // @ts-ignore
    if (typeof window.ethereum !== 'undefined') {
      await this.requestAccount();
      // @ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(this.greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(this.greeting);
      await transaction.wait();
      await this.fetchGreeting();
    }
  }
}

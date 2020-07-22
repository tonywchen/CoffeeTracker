import React from 'react';

const FILL_INCREASE = '#8B572A';
const FILL_DECREASE = '#673E19';
const INITIAL_AMOUNT = 30; // percentage filled
const DELTA = 1; 
const REFRESH_RATE = 16; // corresponds to around 60fps animation

class CoffeeCup extends React.Component {
    state = {
        fill: FILL_INCREASE,
        amount: INITIAL_AMOUNT
    }

    componentDidMount() {
        this.action = this.refill;
        this.animate();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }

    refill = () => {
        let newAmount = (this.state.amount + DELTA) % 100;
        this.setState({
            fill: FILL_INCREASE,
            amount: newAmount
        });
    }

    drinkUp = () =>{
        let newAmount = Math.max(this.state.amount - DELTA, 0);

        this.setState({
            fill: FILL_DECREASE,
            amount: newAmount
        });
    }

    animate = () => {
        this.action();

        this.timeout = setTimeout(this.animate, REFRESH_RATE);
    }

    render() {
        return (
            <svg width="100%" height="100%" viewBox="0 0 200 120" onMouseEnter={() => {this.action = this.drinkUp}} onMouseLeave={() => {this.action = this.refill}}>
                <defs>
                    <mask id="Coffee-Mask">
                        <path d="M5,0 L165,0 C167.761424,-5.07265313e-16 170,2.23857625 170,5 L170,70 C170,97.6142375 147.614237,120 120,120 L50,120 C22.3857625,120 3.38176876e-15,97.6142375 0,70 L0,5 C-3.38176876e-16,2.23857625 2.23857625,5.07265313e-16 5,0 Z" fill="white"></path>
                    </mask>
                </defs>
                <g id="Welcome" stroke="none" strokeWidth="1" fill="none">
                    <g id="CoffeeGroup" mask="url(#Coffee-Mask)">
                        <rect x="0" y="0" width="200" height="120" fill={this.state.fill} style={{
                            transform: `scaleY(${this.state.amount / 100})`,
                            transformOrigin: '50% 100%'
                        }}></rect>
                    </g>
                    <path d="M5,3 C3.8954305,3 3,3.8954305 3,5 L3,70 C3,95.9573832 24.0426168,117 50,117 L120,117 C145.957383,117 167,95.9573832 167,70 L167,5 C167,3.8954305 166.104569,3 165,3 L5,3 Z" id="Cup" stroke="#FFFFFF" strokeWidth="6"></path>
                    <path d="M167,15 L167,70 L190,70 C193.865993,70 197,66.8659932 197,63 L197,22 C197,18.1340068 193.865993,15 190,15 L167,15 Z" id="Handle" stroke="#FFFFFF" strokeWidth="6"></path>
                </g>
            </svg>

        );
    }
}

export default CoffeeCup;
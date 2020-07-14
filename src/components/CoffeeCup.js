import React from 'react';

class CoffeeCup extends React.Component {
    state = {
        fill: '#8B572A',
        amount: 30
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
        this.setState({
            fill: '#8B572A'
        });
        return (this.state.amount + 1) % 100;
    }

    drinkUp = () =>{
        this.setState({
            fill: '#673E19'
        });

        return Math.max(this.state.amount - 1, 0);
    }

    animate = () => {
        let newAmount = this.action();
        this.setState({
            amount: newAmount
        });

        this.timeout = setTimeout(this.animate, 16);
    }

    render() {
        return (
            <svg width="100%" height="100%" viewBox="0 0 200 120" onMouseEnter={() => {this.action = this.drinkUp}} onMouseLeave={() => {this.action = this.refill}}>
                <defs>
                    <mask id="Coffee-Mask" maskUnits="userSpaceOnUnit">
                        <path d="M5,0 L165,0 C167.761424,-5.07265313e-16 170,2.23857625 170,5 L170,70 C170,97.6142375 147.614237,120 120,120 L50,120 C22.3857625,120 3.38176876e-15,97.6142375 0,70 L0,5 C-3.38176876e-16,2.23857625 2.23857625,5.07265313e-16 5,0 Z" fill="white"></path>
                    </mask>
                </defs>
                <g id="Welcome" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="CoffeeGroup" mask="url(#Coffee-Mask)">
                        <rect x="0" y="0" width="200" height="120" fill={this.state.fill} fill-rule="nonzero" style={{
                            transform: `scaleY(${this.state.amount / 100})`,
                            transformOrigin: '50% 100%'
                        }}></rect>
                    </g>
                    <path d="M5,3 C3.8954305,3 3,3.8954305 3,5 L3,70 C3,95.9573832 24.0426168,117 50,117 L120,117 C145.957383,117 167,95.9573832 167,70 L167,5 C167,3.8954305 166.104569,3 165,3 L5,3 Z" id="Cup" stroke="#FFFFFF" stroke-width="6" fill-rule="nonzero"></path>
                    <path d="M167,15 L167,70 L190,70 C193.865993,70 197,66.8659932 197,63 L197,22 C197,18.1340068 193.865993,15 190,15 L167,15 Z" id="Handle" stroke="#FFFFFF" stroke-width="6" fill-rule="nonzero"></path>
                </g>
            </svg>

        );
    }
}

export default CoffeeCup;
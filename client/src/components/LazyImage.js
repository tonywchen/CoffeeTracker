import React from 'react';

const options = {
    rootMargin: '0px',
    threshold: 0
};

class LazyImage extends React.Component {
    constructor() {
        super();
        this.image = React.createRef();
    }

    state = {
        loaded: false
    };

    componentDidMount() {
        if (this.props.eager) {
            this.setState({ loaded: true });
        } else {
            this.observer = new IntersectionObserver((entries) => {
                for (let entry of entries) {
                    if (entry.isIntersecting) {
                        this.setState({ loaded: true });
                        this.observer.unobserve(this.image.current);
                    }
                }
            }, options);
    
            this.observer.observe(this.image.current);
        }
    }

    componentWillUnmount() {
        if (this.observer) {
            this.observer.unobserve(this.image.current);
        }
    }

    onload = () => {
        this.image.current.className = 'lazy-image';
    }

    render() {
        let src = (this.state.loaded)
            ? this.props.src
            : null;

        return (
            <div className={this.props.className}>
                <img
                    ref={this.image}
                    alt={this.props.alt}
                    src={src}
                    className="lazy-image--loading"
                    onLoad={this.onload}
                />
            </div>

        );
    }
}

export default LazyImage;
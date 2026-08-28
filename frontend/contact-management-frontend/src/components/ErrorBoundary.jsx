import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('App crashed:', error, info);
    }

    handleRetry = () => {
        this.setState({ hasError: false });
        window.location.href = '/login';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'Arial, sans-serif' }}>
                    <h2>Something went wrong</h2>
                    <p style={{ color: '#666' }}>Please try again.</p>
                    <button
                        type="button"
                        onClick={this.handleRetry}
                        style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}
                    >
                        Go to Login
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
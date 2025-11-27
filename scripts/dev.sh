#!/bin/bash

# Development helper script for Tezos NFT Burn dApp

set -e

echo "🚀 Tezos NFT Burn dApp - Development Helper"
echo "==========================================="
echo ""

# Function to check if server is running
check_server() {
    if pgrep -f "vite" > /dev/null; then
        echo "✅ Dev server is running"
        return 0
    else
        echo "❌ Dev server is not running"
        return 1
    fi
}

# Function to start server
start_server() {
    echo "🔄 Starting development server..."
    npm run dev
}

# Function to stop server
stop_server() {
    echo "🛑 Stopping development server..."
    pkill -f "vite" || echo "No server to stop"
}

# Function to restart server
restart_server() {
    stop_server
    sleep 2
    start_server
}

# Function to check dependencies
check_deps() {
    echo "📦 Checking dependencies..."
    if [ -d "node_modules" ]; then
        echo "✅ Dependencies installed"
    else
        echo "❌ Dependencies not installed"
        echo "🔄 Installing dependencies..."
        npm install
    fi
}

# Function to show status
show_status() {
    echo "📊 Project Status"
    echo "=================="
    echo ""
    echo "Node version: $(node --version)"
    echo "npm version: $(npm --version)"
    echo ""
    check_server
    echo ""
    echo "Port 3000 status:"
    lsof -i :3000 || echo "Port 3000 is free"
}

# Main menu
case "${1:-help}" in
    start)
        check_deps
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        check_deps
        restart_server
        ;;
    status)
        show_status
        ;;
    install)
        npm install
        ;;
    build)
        echo "🏗️  Building for production..."
        npm run build
        ;;
    clean)
        echo "🧹 Cleaning build artifacts..."
        rm -rf dist node_modules/.vite
        echo "✅ Clean complete"
        ;;
    help|*)
        echo "Usage: ./scripts/dev.sh [command]"
        echo ""
        echo "Commands:"
        echo "  start    - Start development server"
        echo "  stop     - Stop development server"
        echo "  restart  - Restart development server"
        echo "  status   - Show project status"
        echo "  install  - Install dependencies"
        echo "  build    - Build for production"
        echo "  clean    - Clean build artifacts"
        echo "  help     - Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./scripts/dev.sh start"
        echo "  ./scripts/dev.sh status"
        echo "  ./scripts/dev.sh restart"
        ;;
esac

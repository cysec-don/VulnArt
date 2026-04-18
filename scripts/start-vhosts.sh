#!/usr/bin/env bash
# ==============================
# Vuln Art Shop - VHOST Services Manager
# Created & Produced by Cysec Don (cysecdon@gmail.com)
# ==============================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_DIR="$PROJECT_DIR/.vhost-pids"

mkdir -p "$PID_DIR"

start_vhosts() {
    echo "🎨 Starting Vuln Art Shop Virtual Host Services..."
    echo ""

    # Check if Node.js is available
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is required but not installed."
        echo "   Install it from https://nodejs.org"
        exit 1
    fi

    # Start Admin VHOST (port 3001)
    if [ -f "$PID_DIR/admin.pid" ] && kill -0 "$(cat "$PID_DIR/admin.pid")" 2>/dev/null; then
        echo "⚠️  Admin VHOST already running (PID $(cat "$PID_DIR/admin.pid"))"
    else
        node "$SCRIPT_DIR/vhost-admin.js" &
        echo $! > "$PID_DIR/admin.pid"
        echo "✅ Admin VHOST started on port 3001 (PID $(cat "$PID_DIR/admin.pid"))"
    fi

    # Start Dev VHOST (port 3002)
    if [ -f "$PID_DIR/dev.pid" ] && kill -0 "$(cat "$PID_DIR/dev.pid")" 2>/dev/null; then
        echo "⚠️  Dev VHOST already running (PID $(cat "$PID_DIR/dev.pid"))"
    else
        node "$SCRIPT_DIR/vhost-dev.js" &
        echo $! > "$PID_DIR/dev.pid"
        echo "✅ Dev VHOST started on port 3002 (PID $(cat "$PID_DIR/dev.pid"))"
    fi

    # Start Staging VHOST (port 3003)
    if [ -f "$PID_DIR/staging.pid" ] && kill -0 "$(cat "$PID_DIR/staging.pid")" 2>/dev/null; then
        echo "⚠️  Staging VHOST already running (PID $(cat "$PID_DIR/staging.pid"))"
    else
        node "$SCRIPT_DIR/vhost-staging.js" &
        echo $! > "$PID_DIR/staging.pid"
        echo "✅ Staging VHOST started on port 3003 (PID $(cat "$PID_DIR/staging.pid"))"
    fi

    echo ""
    echo "🎯 All virtual host services are running!"
    echo ""
    echo "   Admin:   http://localhost:3001"
    echo "   Dev:     http://localhost:3002"
    echo "   Staging: http://localhost:3003"
    echo ""
    echo "With Nginx configured, access them via:"
    echo "   http://admin.vulnart.local"
    echo "   http://dev.vulnart.local"
    echo "   http://staging.vulnart.local"
}

stop_vhosts() {
    echo "🛑 Stopping Vuln Art Shop Virtual Host Services..."

    for service in admin dev staging; do
        if [ -f "$PID_DIR/$service.pid" ]; then
            PID=$(cat "$PID_DIR/$service.pid")
            if kill -0 "$PID" 2>/dev/null; then
                kill "$PID" 2>/dev/null || true
                echo "✅ $service VHOST stopped (PID $PID)"
            else
                echo "⚠️  $service VHOST was not running"
            fi
            rm -f "$PID_DIR/$service.pid"
        else
            echo "⚠️  $service VHOST: no PID file found"
        fi
    done

    echo ""
    echo "All virtual host services stopped."
}

status_vhosts() {
    echo "📊 Vuln Art Shop Virtual Host Services Status"
    echo ""

    for service in admin dev staging; do
        PORT=""
        case $service in
            admin) PORT=3001 ;;
            dev) PORT=3002 ;;
            staging) PORT=3003 ;;
        esac

        if [ -f "$PID_DIR/$service.pid" ]; then
            PID=$(cat "$PID_DIR/$service.pid")
            if kill -0 "$PID" 2>/dev/null; then
                echo "✅ $service VHOST: Running on port $PORT (PID $PID)"
            else
                echo "❌ $service VHOST: Stale PID file (process $PID not running)"
            fi
        else
            echo "⏹️  $service VHOST: Not running"
        fi
    done
}

case "${1:-}" in
    start)
        start_vhosts
        ;;
    stop)
        stop_vhosts
        ;;
    restart)
        stop_vhosts
        sleep 1
        start_vhosts
        ;;
    status)
        status_vhosts
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        echo ""
        echo "Commands:"
        echo "  start    - Start all virtual host services"
        echo "  stop     - Stop all virtual host services"
        echo "  restart  - Restart all virtual host services"
        echo "  status   - Check status of virtual host services"
        exit 1
        ;;
esac

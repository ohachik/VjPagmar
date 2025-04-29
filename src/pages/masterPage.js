// masterPage.js - WebSocket connection for TouchDesigner

import wixWindow from 'wix-window';

// Global variables for WebSocket connection
let wsConnection = null;
let isConnected = false;

// Initialize when page is ready
$w.onReady(function() {
    // Connect to TouchDesigner WebSocket
    initWebSocketConnection();
    
    // Listen for preset changes from any page
    wixWindow.onMessage((event) => {
        if (event.data && event.data.type === 'sendPreset') {
            sendPreset(event.data.preset);
        }
    });
});

// Initialize WebSocket Connection to TouchDesigner
export function initWebSocketConnection() {
    // IMPORTANT: Update this to your TouchDesigner IP address
    // For local testing on same computer use 'ws://localhost:4443'
    const touchDesignerServer = 'ws://localhost:4443';
    
    try {
        console.log("Connecting to TouchDesigner at:", touchDesignerServer);
        
        // Close previous connection if exists
        if (wsConnection) {
            wsConnection.close();
        }
        
        // Create WebSocket connection
        wsConnection = new WebSocket(touchDesignerServer);
        
        // Connection opened
        wsConnection.onopen = function(event) {
            console.log("Connected to TouchDesigner successfully!");
            isConnected = true;
            
            // Broadcast connection status to all pages
            wixWindow.publish('tdConnectionChanged', 'connected');
        };
        
        // Listen for messages from TouchDesigner
        wsConnection.onmessage = function(event) {
            console.log("Received message from TouchDesigner:", event.data);
            
            try {
                const data = JSON.parse(event.data);
                
                // Handle preset change messages from TouchDesigner
                if (data.preset) {
                    // Broadcast the preset change to all pages
                    wixWindow.publish('tdPresetChanged', data.preset);
                }
            } catch (error) {
                console.error("Error parsing TouchDesigner message:", error);
            }
        };
        
        // Connection closed
        wsConnection.onclose = function(event) {
            console.log("WebSocket connection closed");
            isConnected = false;
            
            // Broadcast connection status to all pages
            wixWindow.publish('tdConnectionChanged', 'disconnected');
            
            // Try to reconnect after 5 seconds
            setTimeout(initWebSocketConnection, 5000);
        };
        
        // Connection error
        wsConnection.onerror = function(error) {
            console.error("WebSocket error:", error);
            isConnected = false;
            
            // Broadcast connection status to all pages
            wixWindow.publish('tdConnectionChanged', 'error');
        };
        
    } catch (error) {
        console.error("Error setting up WebSocket:", error);
    }
}

// Send preset to TouchDesigner
export function sendPreset(presetNumber) {
    if (isConnected && wsConnection.readyState === WebSocket.OPEN) {
        const message = {
            preset: presetNumber
        };
        
        wsConnection.send(JSON.stringify(message));
        console.log(`Sent preset ${presetNumber} to TouchDesigner`);
        return true;
    } else {
        console.warn("Cannot send preset, WebSocket not connected");
        return false;
    }
}

// Export connection status for other pages to check
export function isWebSocketConnected() {
    return isConnected;
}

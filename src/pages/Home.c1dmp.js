// Home.js - Button handlers for TouchDesigner integration

import { sendPreset, isWebSocketConnected } from 'public/masterPage';
import wixWindow from 'wix-window';

$w.onReady(function() {
    // Set up button click handlers
    setupButtonHandlers();
    
    // Listen for connection status changes
    wixWindow.subscribe('tdConnectionChanged', (status) => {
        updateConnectionStatus(status);
    });
    
    // Listen for preset changes from TouchDesigner
    wixWindow.subscribe('tdPresetChanged', (presetNumber) => {
        updateActivePreset(presetNumber);
    });
});

// Set up button handlers
function setupButtonHandlers() {
    // Circle button
    $w("#circle").onClick(() => {
        console.log("Circle button clicked");
        
        if (isWebSocketConnected()) {
            // Send preset 1 (Circles) to TouchDesigner
            sendPreset(1);
            
            // Update UI to show active preset
            updateActivePreset(1);
        } else {
            console.warn("Cannot send preset: WebSocket not connected");
        }
    });
    
    // Squares button
    $w("#squares").onClick(() => {
        console.log("Squares button clicked");
        
        if (isWebSocketConnected()) {
            // Send preset 2 (Squares) to TouchDesigner
            sendPreset(2);
            
            // Update UI to show active preset
            updateActivePreset(2);
        } else {
            console.warn("Cannot send preset: WebSocket not connected");
        }
    });
}

// Update UI to show active preset
function updateActivePreset(presetNumber) {
    console.log(`Updating active preset to: ${presetNumber}`);
    
    // Reset all buttons to inactive state
    $w("#circle").style.backgroundColor = "#000000";  // Black background
    $w("#squares").style.backgroundColor = "#000000"; // Black background
    
    // Set active button's background
    if (presetNumber === 1) {
        $w("#circle").style.backgroundColor = "#3a3a3a";  // Darker gray for active button
    } else if (presetNumber === 2) {
        $w("#squares").style.backgroundColor = "#3a3a3a"; // Darker gray for active button
    }
}

// Update connection status (optional, if you have a status element)
function updateConnectionStatus(status) {
    console.log(`WebSocket status changed to: ${status}`);
    
    // If you have a text element to show connection status, you can update it here
    // Uncomment this if you add a text element with ID "connectionStatus"
    /*
    if (status === 'connected') {
        $w("#connectionStatus").text = "Connected to TouchDesigner";
        $w("#connectionStatus").style.color = "#00ff00"; // Green
    } else if (status === 'disconnected') {
        $w("#connectionStatus").text = "Disconnected from TouchDesigner";
        $w("#connectionStatus").style.color = "#ff0000"; // Red
    } else if (status === 'error') {
        $w("#connectionStatus").text = "Error connecting to TouchDesigner";
        $w("#connectionStatus").style.color = "#ff0000"; // Red
    }
    */
}

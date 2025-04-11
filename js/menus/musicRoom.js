class MusicRoom {
    constructor() {
        this.tracks = this.generateTrackData();
        this.selectedTrack = 0;
        this.currentlyPlaying = 0;
        this.forceShowComment = true;
        this.container = null;
    }

    generateTrackData() {
        const tracks = [];
        // Assuming you have tracks from 01 to 13 based on your original JSON
        for (let i = 1; i <= 13; i++) {
            const trackId = i.toString().padStart(2, '0'); // Formats as '01', '02', etc.
            tracks.push({
                id: trackId,
                name: languageManager.getText(`music.${trackId}.name`) || `Track ${trackId}`,
                title: languageManager.getText(`music.${trackId}.title`) || "",
                comment: languageManager.getText(`music.${trackId}.comment`) || "",
                audioPath: `assets/music/DiPP_${trackId}.mp3`
            });
        }
        return tracks;
    }

    render() {
        // Create container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'music-room-container';
            this.container.innerHTML = `
                <div class="music-room-header">
                    <div class="music-room-title">${languageManager.getText('menus.musicRoomMenu.title')}</div>
                </div>
                <div class="music-room-content">
                    <div class="track-list-container">
                        <div class="track-list"></div>
                    </div>
                    <div class="now-playing"></div>
                </div>
            `;
            
            // Populate track list
            const trackList = this.container.querySelector('.track-list');
            this.tracks.forEach((track, index) => {
                const trackElement = document.createElement('div');
                trackElement.className = `track-item ${this.selectedTrack === index ? 'selected' : ''}`;
                trackElement.innerHTML = `
                    <span class="track-number">${track.id}</span>
                    <span class="track-name">${track.name}</span>
                `;
                trackList.appendChild(trackElement);
            });

            // Add to menu box
            const menuBox = document.getElementById('menuBox');
            if (menuBox) {
                menuBox.innerHTML = '';
                menuBox.appendChild(this.container);
            }
        }

        // Update now-playing section
        const nowPlaying = this.container.querySelector('.now-playing');
        if (nowPlaying) {
            const currentTrack = this.tracks[this.currentlyPlaying];
            const commentLines = currentTrack.comment ? currentTrack.comment.split('<br>') : [];
            const commentHTML = commentLines.map(line => 
                `<div class="comment-line">${line}</div>`
            ).join('');
            
            nowPlaying.innerHTML = `
                <div class="track-title">${currentTrack.title || currentTrack.name}</div>
                <div class="track-comment">${commentHTML}</div>
            `;
        }

        this.updateTrackSelection();
        this.scrollToSelected();
    }

    scrollToSelected() {
        const selectedItem = document.querySelector('.track-item.selected');
        if (selectedItem) {
            selectedItem.scrollIntoView({
                behavior: 'auto',
                block: 'center'
            });
        }
    }

    handleInput() {
        if (window.menuHandler.inputLocked) return false;
        
        // Handle up arrow
        if (window.menuInputHandler.isKeyPressed('ArrowUp')) {
            if (this.selectedTrack === 0) {
                this.selectedTrack = this.tracks.length - 1;
            } else {
                this.selectedTrack--;
            }
            playSoundEffect(soundEffects.select);
            this.updateTrackSelection();
            this.scrollToSelected();
        }
        
        // Handle down arrow
        if (window.menuInputHandler.isKeyPressed('ArrowDown')) {
            if (this.selectedTrack === this.tracks.length - 1) {
                this.selectedTrack = 0;
            } else {
                this.selectedTrack++;
            }
            playSoundEffect(soundEffects.select);
            this.updateTrackSelection();
            this.scrollToSelected();
        }
    
        // Handle Z button (single press)
        if (window.menuInputHandler.isKeyPressed('z') || window.menuInputHandler.isKeyPressed('Z')) {
            playSoundEffect(soundEffects.ok);
            this.playSelectedTrack();
            return false;
        }
    
        // Handle X button (single press)
        if (window.menuInputHandler.isKeyPressed('x') || window.menuInputHandler.isKeyPressed('X')) {
            playSoundEffect(soundEffects.cancel);
            this.stopCurrentTrack();
            window.playMusic("assets/music/DiPP_01.mp3");
            this.selectedTrack = 0;
            window.menuHandler.switchMenu(MENU_STATES.MAIN);
            return true;
        }
    
        return false;
    }

    playSelectedTrack() {
        if (this.tracks.length === 0) return;
        
        // Ensure selectedTrack is within bounds
        if (this.selectedTrack < 0 || this.selectedTrack >= this.tracks.length) {
            this.selectedTrack = 0;
        }
    
        this.stopCurrentTrack();
        
        const track = this.tracks[this.selectedTrack];
        if (!track) return;
        
        this.currentlyPlaying = this.selectedTrack;
        
        // Play the track
        window.playMusic(track.audioPath);
        
        // Update the display
        this.updateNowPlaying();
        this.updateTrackSelection();
    }

    stopCurrentTrack() {
        if (window.musicAudio) {
            window.stopGameMusic();
        }
        this.currentlyPlaying = null;
    }

    updateTrackSelection() {
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedTrack);
        });
        
        // Update now playing if needed
        if (this.selectedTrack === this.currentlyPlaying) {
            this.updateNowPlaying();
        }
    }

    updateNowPlaying() {
        const nowPlaying = document.querySelector('.now-playing');
        if (!nowPlaying || this.tracks.length === 0) return;
        
        // Ensure currentlyPlaying is within bounds
        if (this.currentlyPlaying < 0 || this.currentlyPlaying >= this.tracks.length) {
            this.currentlyPlaying = 0;
        }
    
        const currentTrack = this.tracks[this.currentlyPlaying];
        if (!currentTrack) return;
    
        // Safely handle comment
        const comment = currentTrack.comment || "";
        const commentLines = comment.split('<br>');
        const commentHTML = commentLines.map(line => 
            `<div class="comment-line">${line}</div>`
        ).join('');
        
        nowPlaying.innerHTML = `
            <div class="track-title">${currentTrack.title || currentTrack.name}</div>
            <div class="track-comment">${commentHTML}</div>
        `;
    }
}
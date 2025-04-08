class MusicRoom {
    constructor() {
        this.tracks = [];
        this.selectedTrack = 0;
        this.currentlyPlaying = 0;
        this.loadTrackData();
        this.forceShowComment = true;
        this.container = null;
    }

    loadTrackData() {
        this.tracks = musicData.tracks.map(track => {
            return {
                id: track.ID,
                name: languageManager.getText(`music.${track.ID}.name`) || `Track ${track.ID}`,
                title: languageManager.getText(`music.${track.ID}.title`) || "",
                comment: languageManager.getText(`music.${track.ID}.comment`) || "",
                audioPath: `assets/music/DiPP_${track.ID}.mp3`
            };
        });
        this.tracks.sort((a, b) => parseInt(a.id) - parseInt(b.id));
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
                <div class="music-room-instructions">
                    <div>${languageManager.getText('menus.musicRoomMenu.instructions.Z')}</div>
                    <div>${languageManager.getText('menus.musicRoomMenu.instructions.X')}</div>
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
        this.stopCurrentTrack();
        
        const track = this.tracks[this.selectedTrack];
        this.currentlyPlaying = this.selectedTrack;
        
        // Play the track
        window.playMusic(track.audioPath);
        
        // Update the display without full re-render
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
        if (!nowPlaying) return;
        
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
}
class MusicRoom {
    constructor() {
        this.tracks = [];
        this.selectedTrack = 0;
        this.currentlyPlaying = 0;
        this.loadTrackData();
        this.forceShowComment = true;
        this.MENU_STATES = {
            MAIN: 0,
            OPTIONS: 1,
            CHARACTER_SELECT: 2,
            MUSIC_ROOM: 3
        };
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
        const menuBox = document.getElementById('menuBox');
        if (!menuBox) return;
        
        menuBox.innerHTML = `
            <div class="music-room-container">
                <div class="music-room-header">
                    <div class="music-room-title">${languageManager.getText('musicRoomMenu.title')}</div>
                </div>
                <div class="music-room-content">
                    <div class="track-list-container">
                        <div class="track-list"></div>
                    </div>
                    <div class="now-playing"></div>
                </div>
                <div class="music-room-instructions">
                    <div>${languageManager.getText('musicRoomMenu.instructions.Z')}</div>
                    <div>${languageManager.getText('musicRoomMenu.instructions.X')}</div>
                </div>
            </div>
        `;

        // Populate track list
        const trackList = document.querySelector('.track-list');
        this.tracks.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = `track-item ${this.selectedTrack === index ? 'selected' : ''}`;
            trackElement.innerHTML = `
                <span class="track-number">${track.id}</span>
                <span class="track-name">${track.name}</span>
            `;
            trackList.appendChild(trackElement);
        });

        // Always show comment for first track (menu music)
        const nowPlaying = document.querySelector('.now-playing');
        const currentTrack = this.tracks[this.currentlyPlaying];
        const commentLines = currentTrack.comment ? currentTrack.comment.split('<br>') : [];
        const commentHTML = commentLines.map(line => 
            `<div class="comment-line">${line}</div>`
        ).join('');
        
        nowPlaying.innerHTML = `
            <div class="track-title">${currentTrack.title || currentTrack.name}</div>
            <div class="track-comment">${commentHTML}</div>
        `;
        
        // Auto-scroll to selected item
        this.scrollToSelected();
        
        // Reset flag after first render
        this.forceShowComment = false;
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
        if (inputLocked) return false;
        
        const now = Date.now();
        if (now - lastMenuInput < 100) {
            return false;
        }
        lastMenuInput = now;
    
        if (menuInputHandler.keys.ArrowUp) {
            if (this.selectedTrack === 0) {
                this.selectedTrack = this.tracks.length - 1;
            } else {
                this.selectedTrack--;
            }
            menuInputHandler.keys.ArrowUp = false;
            playSoundEffect(soundEffects.select);
            this.scrollToSelected();
            this.updateTrackSelection();
        }
        
        if (menuInputHandler.keys.ArrowDown) {
            if (this.selectedTrack === this.tracks.length - 1) {
                this.selectedTrack = 0;
            } else {
                this.selectedTrack++;
            }
            menuInputHandler.keys.ArrowDown = false;
            playSoundEffect(soundEffects.select);
            this.scrollToSelected();
            this.updateTrackSelection();
        }
    
        if (menuInputHandler.keys.z || menuInputHandler.keys.Z) {
            playSoundEffect(soundEffects.ok);
            this.playSelectedTrack();
            menuInputHandler.keys.z = false;
            menuInputHandler.keys.Z = false;
        }
    
        if (menuInputHandler.keys.x || menuInputHandler.keys.X) {
            playSoundEffect(soundEffects.cancel);
            this.stopCurrentTrack();
            window.playMusic("assets/music/DiPP_01.mp3");
            this.selectedTrack = 0;
            menuInputHandler.keys.x = false;
            menuInputHandler.keys.X = false;
            transitionToMenu(MENU_STATES.MAIN);
            document.getElementById('menuBox').style.display = 'flex';
            renderMainMenu();
            menuBox.appendChild(titleManager.createTitle());
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
        
        // Update the display
        this.render();
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
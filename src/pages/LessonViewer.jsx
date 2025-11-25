// src/pages/LessonViewer.jsx
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Icons
function IconPlay(props) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
            <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
    );
}

function IconPause(props) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
            <path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
    );
}

function IconVolume(props) {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
            <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        </svg>
    );
}

function IconVolumeMute(props) {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
            <path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
        </svg>
    );
}

function IconMaximize(props) {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
            <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
        </svg>
    );
}

function IconSettings(props) {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
            <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
    );
}

function IconChevronLeft(props) {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
            <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
    );
}

function IconChevronRight(props) {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
            <path fill="currentColor" d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
    );
}

function IconCheck(props) {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
            <path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
    );
}

function IconMenu(props) {
    return (
        <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
    );
}

// Video Player Component
function VideoPlayer({ videoUrl, onVideoEnd }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);

    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    // Check if video URL is YouTube
    const isYouTube = videoUrl && (
        videoUrl.includes('youtube.com/embed/') ||
        videoUrl.includes('youtu.be/') ||
        videoUrl.includes('youtube.com/watch?v=')
    );

    // Convert YouTube URL to embed format
    const getYouTubeEmbedUrl = (url) => {
        if (url.includes('youtube.com/embed/')) {
            return url;
        }
        if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        if (url.includes('youtube.com/watch?v=')) {
            const videoId = url.split('v=')[1].split('&')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }
        return url;
    };

    useEffect(() => {
        if (isYouTube) return; // Skip video events for YouTube
        
        const video = videoRef.current;
        if (!video) return;

        const updateTime = () => setCurrentTime(video.currentTime);
        const updateDuration = () => setDuration(video.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            if (onVideoEnd) onVideoEnd();
        };

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('loadedmetadata', updateDuration);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('loadedmetadata', updateDuration);
            video.removeEventListener('ended', handleEnded);
        };
    }, [videoUrl, onVideoEnd, isYouTube]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            if (newVolume === 0) setIsMuted(true);
            else if (isMuted) setIsMuted(false);
        }
    };

    const handleProgressClick = (e) => {
        const rect = progressRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * duration;

        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleSpeedChange = (speed) => {
        setPlaybackSpeed(speed);
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
        }
        setShowSpeedMenu(false);
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // If YouTube, use iframe
    if (isYouTube) {
        return (
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                        src={getYouTubeEmbedUrl(videoUrl) + '?autoplay=0&rel=0'}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Video player"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
            <div className="relative group">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full aspect-video"
                    onClick={togglePlay}
                    controls={false}
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div
                        ref={progressRef}
                        className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-4 hover:h-2 transition-all"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="h-full bg-indigo-500 rounded-full relative"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={togglePlay}
                                className="hover:bg-white/20 p-2 rounded transition-colors"
                            >
                                {isPlaying ? <IconPause /> : <IconPlay />}
                            </button>

                            <div className="flex items-center gap-2 group/volume">
                                <button
                                    onClick={toggleMute}
                                    className="hover:bg-white/20 p-2 rounded transition-colors"
                                >
                                    {isMuted || volume === 0 ? <IconVolumeMute /> : <IconVolume />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 opacity-0 group-hover/volume:opacity-100 transition-opacity"
                                />
                            </div>

                            <span className="text-sm text-white">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                    className="hover:bg-white/20 p-2 rounded transition-colors flex items-center gap-1 text-white"
                                >
                                    <IconSettings />
                                    <span className="text-sm">{playbackSpeed}x</span>
                                </button>

                                {showSpeedMenu && (
                                    <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg shadow-lg py-2 min-w-[100px] z-10">
                                        {speeds.map((speed) => (
                                            <button
                                                key={speed}
                                                onClick={() => handleSpeedChange(speed)}
                                                className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors text-white ${playbackSpeed === speed ? 'text-indigo-400' : ''
                                                    }`}
                                            >
                                                {speed}x
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={toggleFullscreen}
                                className="hover:bg-white/20 p-2 rounded transition-colors text-white"
                            >
                                <IconMaximize />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main Lesson Viewer Component
export default function LessonViewer() {
    const { id: courseId, lessonId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [enrollment, setEnrollment] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // Fetch course and enrollment
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");
                
                // Fetch course
                const courseResponse = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
                setCourse(courseResponse.data);

                // Fetch enrollment if user is logged in
                const token = localStorage.getItem("ctm_token");
                if (token) {
                    try {
                        const enrollmentsResponse = await axios.get(
                            "http://localhost:5000/api/enrollments/me",
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        
                        // Find enrollment for this course
                        const courseEnrollment = enrollmentsResponse.data.find(
                            (e) => String(e.courseId._id || e.courseId) === String(courseId)
                        );
                        
                        if (courseEnrollment) {
                            setEnrollment(courseEnrollment);
                            // Note: We can't know which specific lessons were completed
                            // since we only store a count. The completedLessons array will
                            // be built up as the user marks lessons complete in this session.
                            // Progress will be shown from the enrollment data.
                        }
                    } catch (err) {
                        console.error("Error fetching enrollment:", err);
                        // Continue without enrollment - user might not be enrolled
                    }
                }
            } catch (err) {
                console.error("Error fetching course:", err);
                setError("Failed to load course. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchData();
        }
    }, [courseId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p className="text-xl">Loading course...</p>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl mb-4">{error || "Course not found"}</p>
                    <button
                        onClick={() => navigate("/courses")}
                        className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    // Flatten all lessons from curriculum
    const allLessons = (course.curriculum || []).flatMap((module, moduleIndex) =>
        (module.topics || []).map((topic, topicIndex) => ({
            ...topic,
            id: topic.id || `${moduleIndex}-${topicIndex}`, // Use topic.id or generate one
            moduleId: module.id || moduleIndex,
            moduleTitle: module.title
        }))
    );

    if (allLessons.length === 0) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <p className="text-xl">No lessons available for this course.</p>
            </div>
        );
    }

    const currentLessonIndex = allLessons.findIndex(l => 
        String(l.id) === String(lessonId) || l.id === Number(lessonId)
    );
    const currentLesson = currentLessonIndex >= 0 ? allLessons[currentLessonIndex] : allLessons[0];
    const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
    const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

    const handleMarkComplete = async () => {
        if (!enrollment || completedLessons.includes(currentLesson.id)) {
            return;
        }

        try {
            setSaving(true);
            
            // Add to local state immediately for UI feedback
            const newCompletedLessons = [...completedLessons, currentLesson.id];
            setCompletedLessons(newCompletedLessons);

            // Calculate new progress
            // Get existing completed count from enrollment and increment by 1
            const existingCompletedCount = enrollment.completedLessons || 0;
            const totalLessons = allLessons.length;
            
            // Ensure completed count doesn't exceed total lessons
            const newCompletedCount = Math.min(existingCompletedCount + 1, totalLessons);
            
            const newProgress = Math.min(100, Math.round((newCompletedCount / totalLessons) * 100));
            const isCompleted = newProgress >= 100;

            // Update enrollment in database
            const token = localStorage.getItem("ctm_token");
            if (token) {
                const response = await axios.put(
                    `http://localhost:5000/api/enrollments/${enrollment._id}`,
                    {
                        progress: newProgress,
                        completed: isCompleted,
                        completedLessons: newCompletedCount,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Update local enrollment state with response data
                setEnrollment(response.data);
            }
        } catch (err) {
            console.error("Error updating progress:", err);
            // Revert local state on error
            setCompletedLessons(completedLessons.filter(id => id !== currentLesson.id));
            alert(err.response?.data?.message || "Failed to save progress. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleVideoEnd = () => {
        handleMarkComplete();
    };

    const handleLessonClick = (lesson) => {
        navigate(`/courses/${courseId}/learn/${lesson.id || lesson._id}`);
    };

    // Calculate progress - use enrollment progress if available, otherwise calculate from completed lessons
    const progressPercentage = enrollment 
        ? enrollment.progress 
        : (completedLessons.length / allLessons.length) * 100;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} bg-gray-800 overflow-y-auto transition-all duration-300 border-r border-gray-700 flex-shrink-0`}>
                {sidebarOpen && (
                    <div className="p-4">
                        {/* Back to Course Button */}
                        <button
                            onClick={() => navigate(`/courses/${courseId}`)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                        >
                            <IconChevronLeft />
                            <span className="text-sm">Back to Course</span>
                        </button>

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold">{course.title}</h2>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1 hover:bg-gray-700 rounded"
                            >
                                <IconChevronLeft />
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                {(() => {
                                    const totalLessons = allLessons.length;
                                    const completedCount = enrollment 
                                        ? Math.min(enrollment.completedLessons || 0, totalLessons)
                                        : completedLessons.length;
                                    return `${completedCount} of ${totalLessons} lessons completed`;
                                })()}
                            </p>
                        </div>

                        {(course.curriculum || []).map((module, moduleIdx) => (
                            <div key={module.id || moduleIdx} className="mb-4">
                                <h3 className="font-semibold text-gray-300 mb-2 px-2 text-sm">{module.title}</h3>
                                {(module.topics || []).map((topic, topicIdx) => {
                                    const topicId = topic.id || `${moduleIdx}-${topicIdx}`;
                                    return (
                                        <button
                                            key={topicId}
                                            onClick={() => handleLessonClick(topic)}
                                            className={`w-full text-left p-3 rounded-lg mb-1 flex items-center justify-between transition-colors ${String(currentLesson?.id) === String(topicId)
                                                ? 'bg-indigo-600 text-white'
                                                : 'hover:bg-gray-700 text-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                {completedLessons.includes(topicId) && (
                                                    <IconCheck className="text-green-400 flex-shrink-0" />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-medium truncate">{topic.title}</div>
                                                    <div className="text-xs text-gray-400">{topic.duration}</div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6">
                    {/* Toggle Sidebar Button */}
                    {!sidebarOpen && (
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="mb-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <IconMenu />
                            <span className="text-sm">Show Curriculum</span>
                        </button>
                    )}

                    {currentLesson && (
                        <>
                            {/* Video Player */}
                            {currentLesson.videoUrl ? (
                                <VideoPlayer
                                    videoUrl={currentLesson.videoUrl}
                                    onVideoEnd={handleVideoEnd}
                                />
                            ) : (
                                <div className="bg-gray-800 rounded-lg p-12 text-center">
                                    <p className="text-gray-400">No video available for this lesson</p>
                                </div>
                            )}

                            {/* Lesson Info */}
                            <div className="mt-6 bg-gray-800 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                                    <div className="flex-1">
                                        <span className="text-sm text-indigo-400 font-medium">{currentLesson.moduleTitle}</span>
                                        <h1 className="text-3xl font-bold mt-1">{currentLesson.title}</h1>
                                        <p className="text-gray-400 mt-1">{currentLesson.duration}</p>
                                    </div>
                                    <button
                                        onClick={handleMarkComplete}
                                        className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${completedLessons.includes(currentLesson.id)
                                            ? 'bg-green-600 text-white cursor-default'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                            }`}
                                        disabled={completedLessons.includes(currentLesson.id) || saving || !enrollment}
                                    >
                                        {saving ? (
                                            'Saving...'
                                        ) : completedLessons.includes(currentLesson.id) ? (
                                            <>
                                                <IconCheck />
                                                Completed
                                            </>
                                        ) : (
                                            'Mark as Complete'
                                        )}
                                    </button>
                                </div>

                                {currentLesson.content && (
                                    <div className="border-t border-gray-700 pt-4">
                                        <h2 className="text-xl font-semibold mb-3">About this lesson</h2>
                                        <p className="text-gray-300 leading-relaxed">{currentLesson.content}</p>
                                    </div>
                                )}
                            </div>

                            {/* Navigation */}
                            <div className="mt-6 flex justify-between gap-4 flex-wrap">
                                {prevLesson ? (
                                    <button
                                        onClick={() => handleLessonClick(prevLesson)}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <IconChevronLeft />
                                        <div className="text-left">
                                            <div className="text-xs text-gray-400">Previous</div>
                                            <div className="font-semibold text-sm">{prevLesson.title}</div>
                                        </div>
                                    </button>
                                ) : <div />}

                                {nextLesson ? (
                                    <button
                                        onClick={() => handleLessonClick(nextLesson)}
                                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors ml-auto"
                                    >
                                        <div className="text-right">
                                            <div className="text-xs text-indigo-200">Next Lesson</div>
                                            <div className="font-semibold text-sm">{nextLesson.title}</div>
                                        </div>
                                        <IconChevronRight />
                                    </button>
                                ) : (
                                    <div className="ml-auto px-6 py-3 bg-green-600 rounded-lg flex items-center gap-2">
                                        <IconCheck />
                                        <span className="font-semibold">Course Complete!</span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
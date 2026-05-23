// import { useState } from 'react';
// import './index.css'; // Make sure your CSS is imported
// import { 
//   useGetTasksQuery, 
//   useAddTaskMutation, 
//   useUpdateTaskMutation, 
//   useDeleteTaskMutation,
//   useDeleteAllTasksMutation 
// } from './features/tasksApi';

// function App() {
//   const [title, setTitle] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [editTitle, setEditTitle] = useState('');
  
//   // RTK Query Hooks
//   const { data: tasks = [], isLoading, isError } = useGetTasksQuery();
//   const [addTask, { isLoading: isAdding }] = useAddTaskMutation();
//   const [updateTask] = useUpdateTaskMutation();
//   const [deleteTask] = useDeleteTaskMutation();
//   const [deleteAllTasks, { isLoading: isDeletingAll }] = useDeleteAllTasksMutation();

//   // Filter tasks based on search
//   const filteredTasks = tasks.filter(task => 
//     task.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Handlers
//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) return;
//     try {
//       await addTask({ title }).unwrap();
//       setTitle(''); 
//     } catch (err) { console.error("Failed to add task", err); }
//   };

//   const handleEditSave = async (id) => {
//     if (!editTitle.trim()) return;
//     try {
//       await updateTask({ id, title: editTitle }).unwrap();
//       setEditingId(null);
//     } catch (err) { console.error("Failed to update task", err); }
//   };

//   const handleToggleComplete = async (task) => {
//     try {
//       await updateTask({ id: task._id, completed: !task.completed }).unwrap();
//     } catch (err) { console.error("Failed to toggle task", err); }
//   };

//   return (
//     <div className="app-container">
//       <h1>Task Manager PWA</h1>
      
//       {/* Search Bar */}
//       <div className="input-group">
//         <input 
//           type="text" 
//           placeholder="Search tasks..." 
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Add Task Form */}
//       <form onSubmit={handleAddSubmit} className="input-group">
//         <input 
//           type="text" 
//           value={title} 
//           onChange={(e) => setTitle(e.target.value)} 
//           placeholder="Add a new task..."
//           disabled={isAdding}
//         />
//         <button type="submit" disabled={isAdding || !title.trim()}>
//           {isAdding ? '...' : 'Add'}
//         </button>
//       </form>

//       {isLoading && <p style={{textAlign: 'center'}}>Loading tasks...</p>}
//       {isError && <p style={{textAlign: 'center', color: 'var(--danger-color)'}}>Error loading tasks.</p>}

//       {/* Task List Header */}
//       {tasks.length > 0 && (
//         <div className="header-actions">
//           <span>{filteredTasks.length} Task(s) found</span>
//           <button 
//             className="btn-danger btn-small" 
//             onClick={() => { if(window.confirm('Delete all tasks?')) deleteAllTasks(); }}
//             disabled={isDeletingAll}
//           >
//             Clear All
//           </button>
//         </div>
//       )}

//       {/* Render the Task List */}
//       <ul className="task-list">
//         {filteredTasks.map(task => (
//           <li key={task._id} className="task-item">
            
//             <div className="task-content">
//               <input 
//                 type="checkbox" 
//                 checked={task.completed} 
//                 onChange={() => handleToggleComplete(task)}
//               />
              
//               {/* Conditional rendering for Edit Mode */}
//               {editingId === task._id ? (
//                 <input 
//                   type="text" 
//                   value={editTitle}
//                   onChange={(e) => setEditTitle(e.target.value)}
//                   autoFocus
//                 />
//               ) : (
//                 <span className={task.completed ? 'completed-text' : ''}>
//                   {task.title}
//                 </span>
//               )}
//             </div>

//             <div className="task-actions">
//               {editingId === task._id ? (
//                 <>
//                   <button className="btn-text" onClick={() => handleEditSave(task._id)}>Save</button>
//                   <button className="btn-text danger" onClick={() => setEditingId(null)}>Cancel</button>
//                 </>
//               ) : (
//                 <>
//                   <button className="btn-text" onClick={() => {
//                     setEditingId(task._id);
//                     setEditTitle(task.title);
//                   }}>Edit</button>
//                   <button className="btn-text danger" onClick={() => deleteTask(task._id)}>Delete</button>
//                 </>
//               )}
//             </div>
//           </li>
//         ))}
//         {filteredTasks.length === 0 && !isLoading && (
//           <li className="task-item" style={{justifyContent: 'center', color: 'var(--text-secondary)'}}>
//             No tasks found.
//           </li>
//         )}
//       </ul>
//     </div>
//   );
// }

// export default App;



// import { useState } from 'react';
// import './index.css';
// import { 
//   useGetTasksQuery, 
//   useAddTaskMutation, 
//   useUpdateTaskMutation, 
//   useDeleteTaskMutation,
//   useDeleteAllTasksMutation 
// } from './features/tasksApi';

// function App() {
//   const [title, setTitle] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [editTitle, setEditTitle] = useState('');
  
//   // NEW: State for current page
//   const [page, setPage] = useState(1);
  
//   // UPDATED: Pass the page to the query. Default data to an empty object.
//   const { data = {}, isLoading, isError, isFetching } = useGetTasksQuery(page);
  
//   // Extract the specific fields from the new backend response
//   const tasks = data.tasks || [];
//   const totalPages = data.totalPages || 1;
//   const totalTasks = data.totalTasks || 0;

//   const [addTask, { isLoading: isAdding }] = useAddTaskMutation();
//   const [updateTask] = useUpdateTaskMutation();
//   const [deleteTask] = useDeleteTaskMutation();
//   const [deleteAllTasks, { isLoading: isDeletingAll }] = useDeleteAllTasksMutation();

//   // Filter logic (Note: This only filters the CURRENT page of tasks)
//   const filteredTasks = tasks.filter(task => 
//     task.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) return;
//     try {
//       await addTask({ title }).unwrap();
//       setTitle(''); 
//       setPage(1); // Optional: Jump back to page 1 to see the new task
//     } catch (err) { console.error("Failed to add task", err); }
//   };

//   const handleEditSave = async (id) => {
//     if (!editTitle.trim()) return;
//     try {
//       await updateTask({ id, title: editTitle }).unwrap();
//       setEditingId(null);
//     } catch (err) { console.error("Failed to update task", err); }
//   };

//   const handleToggleComplete = async (task) => {
//     try {
//       await updateTask({ id: task._id, completed: !task.completed }).unwrap();
//     } catch (err) { console.error("Failed to toggle task", err); }
//   };

//   return (
//     <div className="app-container">
//       <h1>Task Manager PWA</h1>
      
//       <div className="input-group">
//         <input 
//           type="text" 
//           placeholder="Search this page..." 
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       <form onSubmit={handleAddSubmit} className="input-group">
//         <input 
//           type="text" 
//           value={title} 
//           onChange={(e) => setTitle(e.target.value)} 
//           placeholder="Add a new task..."
//           disabled={isAdding}
//         />
//         <button type="submit" disabled={isAdding || !title.trim()}>
//           {isAdding ? '...' : 'Add'}
//         </button>
//       </form>

//       {/* Show slightly dim UI while fetching new pages */}
//       <div style={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        
//         {tasks.length > 0 && (
//           <div className="header-actions">
//             <span>Showing {tasks.length} of {totalTasks} tasks</span>
//             <button 
//               className="btn-danger btn-small" 
//               onClick={() => { if(window.confirm('Delete all tasks?')) deleteAllTasks(); setPage(1); }}
//               disabled={isDeletingAll}
//             >
//               Clear All
//             </button>
//           </div>
//         )}

//         <ul className="task-list">
//           {filteredTasks.map(task => (
//              <li key={task._id} className="task-item">
//              <div className="task-content">
//                <input 
//                  type="checkbox" 
//                  checked={task.completed} 
//                  onChange={() => handleToggleComplete(task)}
//                />
               
//                {editingId === task._id ? (
//                  <input 
//                    type="text" 
//                    value={editTitle}
//                    onChange={(e) => setEditTitle(e.target.value)}
//                    autoFocus
//                  />
//                ) : (
//                  <span className={task.completed ? 'completed-text' : ''}>
//                    {task.title}
//                  </span>
//                )}
//              </div>
 
//              <div className="task-actions">
//                {editingId === task._id ? (
//                  <>
//                    <button className="btn-text" onClick={() => handleEditSave(task._id)}>Save</button>
//                    <button className="btn-text danger" onClick={() => setEditingId(null)}>Cancel</button>
//                  </>
//                ) : (
//                  <>
//                    <button className="btn-text" onClick={() => {
//                      setEditingId(task._id);
//                      setEditTitle(task.title);
//                    }}>Edit</button>
//                    <button className="btn-text danger" onClick={() => deleteTask(task._id)}>Delete</button>
//                  </>
//                )}
//              </div>
//            </li>
//           ))}
//           {filteredTasks.length === 0 && !isLoading && (
//             <li className="task-item" style={{justifyContent: 'center', color: 'var(--text-secondary)'}}>
//               No tasks found.
//             </li>
//           )}
//         </ul>

//         {/* NEW: Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="pagination-controls">
//             <button 
//               className="btn-small"
//               disabled={page === 1} 
//               onClick={() => setPage(prev => prev - 1)}
//             >
//               Previous
//             </button>
//             <span>Page {page} of {totalPages}</span>
//             <button 
//               className="btn-small"
//               disabled={page === totalPages} 
//               onClick={() => setPage(prev => prev + 1)}
//             >
//               Next
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// export default App;






// import { useState, useEffect, useRef } from 'react';
// import './index.css';
// import { 
//   useGetTasksQuery, 
//   useAddTaskMutation, 
//   useUpdateTaskMutation, 
//   useDeleteTaskMutation,
//   useDeleteAllTasksMutation 
// } from './features/tasksApi';

// function App() {
//   // --- Local State ---
//   const [title, setTitle] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [editTitle, setEditTitle] = useState('');
//   const [page, setPage] = useState(1);
  
//   // --- Infinite Scroll Reference ---
//   const observerTarget = useRef(null);
  
//   // --- RTK Query Hooks ---
//   const { data = {}, isLoading, isError, isFetching } = useGetTasksQuery(page);
  
//   // Extract data from the backend response
//   const tasks = data.tasks || [];
//   const totalPages = data.totalPages || 1;
//   const totalTasks = data.totalTasks || 0;

//   const [addTask, { isLoading: isAdding }] = useAddTaskMutation();
//   const [updateTask] = useUpdateTaskMutation();
//   const [deleteTask] = useDeleteTaskMutation();
//   const [deleteAllTasks, { isLoading: isDeletingAll }] = useDeleteAllTasksMutation();

//   // --- Filtering ---
//   // Note: This filters the currently loaded chunks of data on the screen
//   const filteredTasks = tasks.filter(task => 
//     task.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // --- Infinite Scroll Logic ---
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         // If the bottom target is visible, and we haven't reached the last page, and we aren't already loading...
//         if (entries[0].isIntersecting && page < totalPages && !isFetching) {
//           setPage(prevPage => prevPage + 1); // Load next page
//         }
//       },
//       { threshold: 1.0 }
//     );

//     if (observerTarget.current) {
//       observer.observe(observerTarget.current);
//     }

//     // Cleanup function
//     return () => {
//       if (observerTarget.current) observer.unobserve(observerTarget.current);
//     };
//   }, [observerTarget, page, totalPages, isFetching]);

//   // --- Event Handlers ---
//   // const handleAddSubmit = async (e) => {
//   //   e.preventDefault();
//   //   if (!title.trim()) return;
//   //   try {
//   //     await addTask({ title }).unwrap();
//   //     setTitle(''); 
//   //     setPage(1); // Jump back to top to see the new task
//   //   } catch (err) { 
//   //     console.error("Failed to add task", err); 
//   //   }
//   // };

//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) return;

//     // 1. Save the title to a temporary variable
//     const currentTitle = title;
    
//     // 2. CLEAR THE UI INSTANTLY (Do not wait for the network!)
//     setTitle(''); 
//     setPage(1);

//     try {
//       // 3. Fire the mutation
//       await addTask({ title: currentTitle }).unwrap();
//     } catch (err) { 
//       // 4. If we are offline, it will fail here. But because we already 
//       // cleared the UI and have Optimistic Updates running, the user 
//       // will not notice. Workbox will handle the sync in the background!
//       console.log("Network failed, but Workbox has queued the task."); 
//     }
//   };

//   const handleEditSave = async (id) => {
//     if (!editTitle.trim()) return;
//     try {
//       await updateTask({ id, title: editTitle }).unwrap();
//       setEditingId(null);
//     } catch (err) { 
//       console.error("Failed to update task", err); 
//     }
//   };

//   const handleToggleComplete = async (task) => {
//     try {
//       await updateTask({ id: task._id, completed: !task.completed }).unwrap();
//     } catch (err) { 
//       console.error("Failed to toggle task", err); 
//     }
//   };

//   const handleClearAll = async () => {
//     if (window.confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
//       try {
//         await deleteAllTasks().unwrap();
//         setPage(1); // Reset pagination after clearing
//       } catch (err) {
//         console.error("Failed to clear tasks", err);
//       }
//     }
//   };

//   // --- Render UI ---
//   return (
//     <div className="app-container">
//       <h1>Task Manager PWA</h1>
      
//       {/* Search Bar */}
//       <div className="input-group">
//         <input 
//           type="text" 
//           placeholder="Search loaded tasks..." 
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Add Task Form */}
//       <form onSubmit={handleAddSubmit} className="input-group">
//         <input 
//           type="text" 
//           value={title} 
//           onChange={(e) => setTitle(e.target.value)} 
//           placeholder="Add a new task..."
//           disabled={isAdding}
//         />
//         <button type="submit" disabled={isAdding || !title.trim()}>
//           {isAdding ? '...' : 'Add'}
//         </button>
//       </form>

//       {/* Loading & Error States */}
//       {isLoading && page === 1 && <p style={{textAlign: 'center'}}>Loading tasks...</p>}
//       {isError && <p style={{textAlign: 'center', color: 'var(--danger-color)'}}>Error loading tasks.</p>}

//       {/* Stats Header & Clear All */}
//       {tasks.length > 0 && (
//         <div className="header-actions">
//           <span>Showing {tasks.length} of {totalTasks} tasks</span>
//           <button 
//             className="btn-danger btn-small" 
//             onClick={handleClearAll}
//             disabled={isDeletingAll}
//           >
//             Clear All
//           </button>
//         </div>
//       )}

//       {/* Task List */}
//       <ul className="task-list">
//         {filteredTasks.map(task => (
//            <li key={task._id} className="task-item">
             
//              <div className="task-content">
//                <input 
//                  type="checkbox" 
//                  checked={task.completed} 
//                  onChange={() => handleToggleComplete(task)}
//                />
               
//                {/* Edit Mode Toggle */}
//                {editingId === task._id ? (
//                  <input 
//                    type="text" 
//                    value={editTitle}
//                    onChange={(e) => setEditTitle(e.target.value)}
//                    autoFocus
//                    onKeyDown={(e) => e.key === 'Enter' && handleEditSave(task._id)}
//                  />
//                ) : (
//                  <span className={task.completed ? 'completed-text' : ''}>
//                    {task.title}
//                  </span>
//                )}
//              </div>
 
//              <div className="task-actions">
//                {editingId === task._id ? (
//                  <>
//                    <button className="btn-text" onClick={() => handleEditSave(task._id)}>Save</button>
//                    <button className="btn-text danger" onClick={() => setEditingId(null)}>Cancel</button>
//                  </>
//                ) : (
//                  <>
//                    <button className="btn-text" onClick={() => {
//                      setEditingId(task._id);
//                      setEditTitle(task.title);
//                    }}>Edit</button>
//                    <button className="btn-text danger" onClick={() => deleteTask(task._id)}>Delete</button>
//                  </>
//                )}
//              </div>
//            </li>
//         ))}
        
//         {/* Empty State */}
//         {filteredTasks.length === 0 && !isLoading && (
//           <li className="task-item" style={{justifyContent: 'center', color: 'var(--text-secondary)'}}>
//             No tasks found.
//           </li>
//         )}
//       </ul>

//       {/* --- INVISIBLE TARGET FOR INFINITE SCROLL --- */}
//       <div ref={observerTarget} style={{ height: '10px', width: '100%' }}></div>

//       {/* Fetching Indicator for next pages */}
//       {isFetching && page > 1 && (
//         <p style={{ textAlign: 'center', color: 'var(--text-secondary)', paddingBottom: '20px' }}>
//           Loading more tasks...
//         </p>
//       )}

//     </div>
//   );
// }

// export default App;





import { useState, useEffect, useRef } from 'react';
import './index.css';
import { 
  useGetTasksQuery, 
  useAddTaskMutation, 
  useUpdateTaskMutation, 
  useDeleteTaskMutation,
  useDeleteAllTasksMutation 
} from './features/tasksApi';

function App() {
  // --- Local State ---
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [page, setPage] = useState(1);
  
  // --- NEW: Track Offline Status ---
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // --- Infinite Scroll Reference ---
  const observerTarget = useRef(null);
  
  // --- RTK Query Hooks ---
  const { data = {}, isLoading, isError, isFetching } = useGetTasksQuery(page);
  
  const tasks = data.tasks || [];
  const totalPages = data.totalPages || 1;
  const totalTasks = data.totalTasks || 0;

  const [addTask, { isLoading: isAdding }] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [deleteAllTasks, { isLoading: isDeletingAll }] = useDeleteAllTasksMutation();

  // --- Filtering ---
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Infinite Scroll Logic ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !isFetching) {
          setPage(prevPage => prevPage + 1); 
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [observerTarget, page, totalPages, isFetching]);

  // --- Event Handlers ---
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // 1. Save the title to a temporary variable
    const currentTitle = title;
    
    // 2. CLEAR THE UI INSTANTLY (Do not wait for the network!)
    setTitle(''); 
    
    // ONLY reset the page if we are online. If offline, stay where we are so Optimistic UI holds!
    if (!isOffline) {
      setPage(1);
    }

    try {
      // 3. Fire the mutation
      await addTask({ title: currentTitle }).unwrap();
    } catch (err) { 
      // 4. If we are offline, Workbox queues it.
      console.log("Network failed, but Workbox has queued the task."); 
    }
  };

  const handleEditSave = async (id) => {
    if (!editTitle.trim()) return;
    try {
      await updateTask({ id, title: editTitle }).unwrap();
      setEditingId(null);
    } catch (err) { 
      console.error("Failed to update task", err); 
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask({ id: task._id, completed: !task.completed }).unwrap();
    } catch (err) { 
      console.error("Failed to toggle task", err); 
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
      try {
        await deleteAllTasks().unwrap();
        setPage(1); 
      } catch (err) {
        console.error("Failed to clear tasks", err);
      }
    }
  };

  // --- Render UI ---
  return (
    <div className="app-container">
      
      {/* --- Offline Warning Banner --- */}
      {isOffline && (
        <div style={{
          backgroundColor: 'var(--danger-color)',
          color: 'white',
          padding: '10px',
          textAlign: 'center',
          borderRadius: '8px',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          You are offline. Changes will sync when you reconnect.
        </div>
      )}

      <h1>Task Manager PWA</h1>
      
      {/* Search Bar */}
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Search loaded tasks..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddSubmit} className="input-group">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Add a new task..."
          disabled={isAdding && !isOffline}
        />
        <button type="submit" disabled={(isAdding && !isOffline) || !title.trim()}>
          {(isAdding && !isOffline) ? '...' : 'Add'}
        </button>
      </form>

      {/* Loading & Error States */}
      {isLoading && page === 1 && <p style={{textAlign: 'center'}}>Loading tasks...</p>}
      {isError && <p style={{textAlign: 'center', color: 'var(--danger-color)'}}>Error loading tasks.</p>}

      {/* Stats Header & Clear All */}
      {tasks.length > 0 && (
        <div className="header-actions">
          <span>Showing {tasks.length} of {totalTasks} tasks</span>
          <button 
            className="btn-danger btn-small" 
            onClick={handleClearAll}
            disabled={isDeletingAll}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Task List */}
      <ul className="task-list">
        {filteredTasks.map(task => (
           <li key={task._id} className="task-item">
             
             <div className="task-content">
               <input 
                 type="checkbox" 
                 checked={task.completed} 
                 onChange={() => handleToggleComplete(task)}
               />
               
               {/* Edit Mode Toggle */}
               {editingId === task._id ? (
                 <input 
                   type="text" 
                   value={editTitle}
                   onChange={(e) => setEditTitle(e.target.value)}
                   autoFocus
                   onKeyDown={(e) => e.key === 'Enter' && handleEditSave(task._id)}
                 />
               ) : (
                 <span className={task.completed ? 'completed-text' : ''}>
                   {task.title}
                 </span>
               )}
             </div>
 
             <div className="task-actions">
               {editingId === task._id ? (
                 <>
                   <button className="btn-text" onClick={() => handleEditSave(task._id)}>Save</button>
                   <button className="btn-text danger" onClick={() => setEditingId(null)}>Cancel</button>
                 </>
               ) : (
                 <>
                   <button className="btn-text" onClick={() => {
                     setEditingId(task._id);
                     setEditTitle(task.title);
                   }}>Edit</button>
                   <button className="btn-text danger" onClick={() => deleteTask(task._id)}>Delete</button>
                 </>
               )}
             </div>
           </li>
        ))}
        
        {/* Empty State */}
        {filteredTasks.length === 0 && !isLoading && (
          <li className="task-item" style={{justifyContent: 'center', color: 'var(--text-secondary)'}}>
            No tasks found.
          </li>
        )}
      </ul>

      {/* --- INVISIBLE TARGET FOR INFINITE SCROLL --- */}
      <div ref={observerTarget} style={{ height: '10px', width: '100%' }}></div>

      {/* Fetching Indicator for next pages */}
      {isFetching && page > 1 && (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', paddingBottom: '20px' }}>
          Loading more tasks...
        </p>
      )}

    </div>
  );
}

export default App;
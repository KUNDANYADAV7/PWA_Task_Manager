import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    // getTasks: builder.query({
    //   query: () => '/tasks',
    //   providesTags: ['Task'],
    // }),


    // getTasks: builder.query({
    //   // Accept a page argument, default to 1
    //   query: (page = 1) => `/tasks?page=${page}&limit=5`,
    //   providesTags: ['Task'],
    // }),

    getTasks: builder.query({
      query: (page = 1) => `/tasks?page=${page}&limit=5`,
      providesTags: ['Task'],
      
      // --- NEW: INFINITE SCROLL LOGIC ---
      
      // 1. Force all pages to share the exact same cache space
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // 2. Merge the new page of tasks into the existing list
      merge: (currentCache, newItems) => {
        if (newItems.currentPage === 1) {
          return newItems; // If we restart at page 1, replace the whole list
        }
        currentCache.tasks.push(...newItems.tasks); // Attach new items to the bottom
        currentCache.currentPage = newItems.currentPage;
        currentCache.totalPages = newItems.totalPages;
      },
      // 3. Tell Redux to trigger a network request when the page number changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      }
      
      // ----------------------------------
    }),
    // addTask: builder.mutation({
    //   query: (task) => ({ url: '/tasks', method: 'POST', body: task }),
    //   invalidatesTags: ['Task'],
    // }),
    addTask: builder.mutation({
      query: (task) => ({ url: '/tasks', method: 'POST', body: task }),
      
      // --- OPTIMISTIC UPDATE LOGIC ---
      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        
        // 1. Instantly update the cached data for Page 1
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', 1, (draft) => {
            // Create a temporary "mock" task. 
            // We give it a fake ID so React's map() function doesn't crash.
            const optimisticTask = {
              _id: `temp-${Date.now()}`, 
              title: task.title,
              completed: false,
            };
            
            // Push the fake task to the top of the list and update the total count
            draft.tasks.unshift(optimisticTask);
            draft.totalTasks += 1;
          })
        );

        try {
          // 2. Wait to see what the actual network request does
          await queryFulfilled;
        } catch (err) {
          // 3. THE PWA MAGIC EXCEPTION:
          // In a normal React app, if the network fails, you would run `patchResult.undo()` 
          // right here to delete the fake task from the screen.
          // 
          // BUT, because we are using Workbox Background Sync, we know the request isn't 
          // truly dead—it's just waiting in IndexedDB. Therefore, we deliberately DO NOT 
          // undo it. We leave the fake task on the screen so the user thinks it succeeded!
          console.log("Network failed, but Workbox queued the task for Background Sync.");
        }
      },
      // -------------------------------
      
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({ url: `/tasks/${id}`, method: 'PUT', body: patch }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Task'],
    }),
    deleteAllTasks: builder.mutation({
      query: () => ({ url: '/tasks', method: 'DELETE' }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const { 
  useGetTasksQuery, 
  useAddTaskMutation, 
  useUpdateTaskMutation, 
  useDeleteTaskMutation,
  useDeleteAllTasksMutation
} = tasksApi;



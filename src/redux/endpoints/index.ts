import { ApiService } from "../middlewares/api";
import {
  Projects,
  SearchResultsType,
  TaskDataType,
  Team,
  UsersType,
  UserType,
} from "./interfaces";

const ApiendPoints = ApiService.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<Projects[], void>({
      query: () => ({
        url: "/projects",
      }),
      providesTags: ["Projects"],
      transformResponse: (
        results: { response: { data: Array<Projects> } },
        meta,
        arg,
      ) => results.response.data,
    }),
    createProjects: build.mutation<Projects, Partial<Projects>>({
      query: (prjectInfo) => ({
        url: "/projects/create",
        method: "POST",
        body: prjectInfo,
      }),
      invalidatesTags: ["Projects"],
    }),

    getTask: build.query<TaskDataType[], { projectId: number }>({
      query: ({ projectId }) => ({
        url: `/tasks?projectId=${projectId}`,
      }),
      // This will make only affected task to get refetch not all task make to optimize the code
      providesTags: (results) =>
        results
          ? results?.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],

      transformResponse: (
        results: { response: { data: Array<TaskDataType> } },
        meta,
        arg,
      ) => results.response.data,
    }),
    getTaskbyPriority: build.query<TaskDataType[], number>({
      query: (userId) => ({
        url: `/prioritytasks/${userId}`,
      }),
      providesTags: (results, error, userId) =>
        results
          ? results.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const, id: Number(userId) }],

      transformResponse: (
        results: { response: { data: Array<TaskDataType> } },
        meta,
        arg,
      ) => results.response.data,
    }),

    createTasks: build.mutation<TaskDataType, Partial<TaskDataType>>({
      query: (taskInfo) => ({
        url: "/tasks/create",
        method: "POST",
        body: taskInfo,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTasks: build.mutation<
      TaskDataType,
      { taskId: number; status: string }
    >({
      query: ({ taskId, status }) => ({
        url: `/tasks/status/?taskId=${taskId}`,
        method: "PATCH",
        body: status,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),
    search: build.query<SearchResultsType, string>({
      query: (query) => ({
        url: `/search?query=${query}`,
      }),
    }),
    getusers: build.query<UsersType, void>({
      query: () => ({
        url: `/users`,
      }),
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "/teams",
      providesTags: ["Teams"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectsMutation,
  useCreateTasksMutation,
  useGetTaskQuery,
  useUpdateTasksMutation,
  useSearchQuery,
  useGetusersQuery,
  useGetTeamsQuery,
  useGetTaskbyPriorityQuery,
} = ApiendPoints;

import { useState, useRef, useEffect } from "react";
import api from "../config/Api";
import toast from "react-hot-toast";
import Calendar from "../pages/Admin/calender"; // Custom Calendar component

const UserDashboard = () => {
  const [taskForToday, setTaskForToday] = useState(null); // Admin task for today
  const [answer, setAnswer] = useState(""); // User's answer
  const [loading, setLoading] = useState(false);
  const [submittedDates, setSubmittedDates] = useState([]);
  const textareaRef = useRef(null);

  // ✅ Fetch today's task & previously submitted tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      // 1. Fetch tasks assigned to user
      const res = await api.get("/auth/getTasks", { withCredentials: true });
      const tasks = res.data.tasks || [];

      // find today's task
      const todayStr = new Date().toDateString();
      const todayTask = tasks.find(
        (t) => new Date(t.date).toDateString() === todayStr
      );
      setTaskForToday(todayTask || null);

      // get all submitted dates
      const dates = tasks
        .filter((t) => t.completed)
        .map((t) => new Date(t.date).toDateString());
      setSubmittedDates(dates);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks");
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return toast.error("Please enter your answer");

    setLoading(true);
    try {
      // ✅ backend पर सिर्फ answer भेजना है
      const res = await api.post(
        "/auth/taskSubmit",
        { answer },
        { withCredentials: true }
      );

      toast.success(res.data.message);

      const today = new Date().toDateString();
      setSubmittedDates((prev) => [...prev, today]);

      setAnswer("");
      fetchTasks(); // refresh tasks
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to submit task");
    } finally {
      setLoading(false);
    }
  };

  const handleNoCopyPaste = (e) => e.preventDefault();

  const handleInput = (e) => {
    setAnswer(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  // ✅ Allowed time: 10AM – 5PM
  const now = new Date();
  const hours = now.getHours();
  const allowed = hours >= 10 && hours < 17;

  const todaySubmitted = submittedDates.includes(new Date().toDateString());

  return (
    <div className="bg-[#1F1F1F] min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold text-[#00BFA5] mb-6 text-center">
        User Dashboard
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Calendar */}
        <div className="w-full lg:w-1/3 bg-[#2C2C2C] p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-[#EEEEEE] mb-4">
            Calendar
          </h2>
          <Calendar submittedDates={submittedDates} />
        </div>

        {/* Task box */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          {taskForToday ? (
            <>
              {/* Task from Admin */}
              <div className="p-4 rounded-lg bg-[#2C2C2C] border border-[#00BFA5] text-[#E0E0E0]">
                <p className="font-medium">Today's Task:</p>
                <p className="mt-1">{taskForToday.title}</p>
              </div>

              {!allowed ? (
                <p className="text-center text-yellow-400">
                  ⏰ You can only submit tasks between 10AM – 5PM
                </p>
              ) : todaySubmitted ? (
                <p className="text-center text-green-400">
                  ✅ You already submitted today's task
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  <textarea
                    ref={textareaRef}
                    placeholder="Enter your answer..."
                    value={answer}
                    onChange={handleInput}
                    onCopy={handleNoCopyPaste}
                    onCut={handleNoCopyPaste}
                    onPaste={handleNoCopyPaste}
                    rows={8}
                    className="w-full px-4 py-2 rounded-lg bg-[#2C2C2C] border border-[#00BFA5] text-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#00BFA5] resize-none overflow-hidden"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-2 rounded-lg bg-[#00BFA5] text-[#1F1F1F] font-semibold hover:bg-[#E0E0E0] hover:text-[#1F1F1F] transition disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-[#9E9E9E]">
              No task assigned for today.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

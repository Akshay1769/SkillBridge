const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const requireAuth = require("../middleware/auth");





router.post("/sync-user", requireAuth, async (req, res) => {
  const clerkUserId = req.auth.userId;
  const { name, role } = req.body;

  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("clerk_user_id", clerkUserId)
      .select();

    return res.json(data[0]);
  }

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name,
        role,
        clerk_user_id: clerkUserId,
      },
    ])
    .select();

  res.json(data[0]);
});


router.get("/me", requireAuth, async (req, res) => {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", req.auth.userId)
    .single();

  res.json(data);
});



router.get("/", requireAuth, async (req, res)=> {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.json(data);
});






router.post("/sessions", requireAuth, async (req, res) => {
  const { title, date, batchId } = req.body;


  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", req.auth.userId)
    .single();

  if (userError || !user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (user.role !== "Trainer") {
    return res.status(403).json({
      message: "Only trainers can create sessions",
    });
  }

  const { data, error } = await supabase
    .from("sessions")
    .insert([
      {
        title,
        date,
        batch_id: batchId,
        trainer_id: user.id,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.json({
    message: "Session created",
    session: data[0],
  });
});



router.post("/attendance", requireAuth, async (req, res) => {
  const clerkUserId = req.auth.userId;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  const { sessionId, status } = req.body;

  const { data: existing } = await supabase
    .from("attendance")
    .select("*")
    .eq("session_id", sessionId)
    .eq("student_id", user.id)

  if (existing && existing.length > 0) {
    return res.status(400).json({
      message: "Attendance already marked",
    });
  }

  const { data, error } = await supabase
    .from("attendance")
    .insert([
      {
        session_id: sessionId,
        student_id: user.id,
        status,
      },
    ])
    .select();

  res.json(data);
});


router.get("/attendance/:sessionId", requireAuth, async (req, res) => {
  const { sessionId } = req.params;

  const { data , error } = await supabase
    .from("attendance")
    .select("*")
    .eq("session_id", sessionId);

    if(error){
        return res.status(500).json({
            message: error.message,
        });
    }


  res.json(data);
});




router.post("/batches", requireAuth, async (req, res) => {
  const { name } = req.body;

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", req.auth.userId)
    .single();

  if (userError || !user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "Trainer") {
    return res.status(403).json({
      message: "Only trainers can create batches",
    });
  }

  const inviteCode = Math.random().toString(36).substring(7);

  const { data, error } = await supabase
    .from("batches")
    .insert([
      {
        name,
        invite_code: inviteCode,
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data[0]);
});





router.get("/batches", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("batches")
    .select("*");

  if (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.json(data);
});




router.post("/batches/join", requireAuth, async (req, res) => {
  const { inviteCode } = req.body;

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", req.auth.userId)
    .single();

  if (userError || !user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role !== "Student") {
    return res.status(403).json({
      message: "Only students can join batches",
    });
  }

  const { data: batch, error } = await supabase
    .from("batches")
    .select("*")
    .eq("invite_code", inviteCode)
    .single();

  if (error || !batch) {
    return res.status(404).json({
      message: "Invalid invite code",
    });
  }

  await supabase.from("batch_students").insert([
    {
      batch_id: batch.id,
      student_id: user.id,
    },
  ]);

  res.json({
    message: "Joined batch successfully",
    batch,
  });
});




router.get("/sessions/:id/attendance", requireAuth, async (req, res) => {
  const sessionId = req.params.id;

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("session_id", sessionId);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
});


router.get("/batches/:id/summary", requireAuth, async (req, res) => {
  const batchId = req.params.id;

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("batch_id", batchId);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
});



router.get("/programme/summary", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("attendance")
    .select("*");

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
});



module.exports = router;
import Team from '../models/Team.js';

// Get all teams
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('teamMembers', 'fullName email role');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single team
export const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('teamMembers', 'fullName email role');
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create team
export const createTeam = async (req, res) => {
  try {
    const { teamName, company, teamMembers } = req.body;

    if (!teamName || !company) {
      return res.status(400).json({ error: 'teamName and company are required' });
    }

    const team = new Team({
      teamName,
      company,
      teamMembers: teamMembers || []
    });

    await team.save();
    await team.populate('teamMembers', 'fullName email role');

    res.status(201).json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update team
export const updateTeam = async (req, res) => {
  try {
    const { teamName, company, teamMembers } = req.body;

    const team = await Team.findByIdAndUpdate(
      req.params.id,
      {
        teamName,
        company,
        teamMembers: teamMembers || [],
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('teamMembers', 'fullName email role');

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete team
export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

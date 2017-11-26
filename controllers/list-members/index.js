/**
 * Function to get list members from collection. Currying function data needs
 * the Members model as first argument in order to isolate the scope.
 * @param  {Object} MembersModel Model for Members collection
 * @return {Function}            function with endpoint callback signature
 */
function getMembersList (MembersModel) {
  if (!MembersModel) throw new Error('Members Model is missing');
  return async function (req, res) {
    // Define members variable
    let members;

    const { id } = req.query;

    const query = id ? { _id: id } : {};

    // Try to fetch members
    try {
      members = await MembersModel.find(query).sort({ number: 1 });
    } catch (fetchMembersError) {
      return res.status(400).send(`Error: ${fetchMembersError.message}`);
    }

    const mappedMembers = members.map(member => {
      return {
        id: member._id,
        first_name: member.first_name,
        last_name: member.last_name,
        number: member.number,
        email: member.email,
      };
    });

    return res.json(mappedMembers);
  };
}

module.exports = {
  getMembersList,
};

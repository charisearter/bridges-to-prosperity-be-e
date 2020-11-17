const db = require('../../data/db-config');

function findWatchlist(id) {
  return db('watchlist')
    .where('watchlist.profile_id', id)
    .join(
      'watchlist_bridges',
      'watchlist.profile_id',
      'watchlist_bridges.list_id'
    )
    .select(
      'watchlist.profile_id',
      'watchlist.notes',
      'watchlist.list_title',
      'watchlist_bridges.project'
    );
}

const addWatchlist = async (list_title, profile_id, notes, bridge_array) => {
  console.log(list_title, profile_id, notes, bridge_array);
  try {
    await db('watchlist').insert({
      list_title,
      profile_id,
      notes,
    });
    // Bridge_array is an array of bridges - mapping through the array
    bridge_array.forEach(async (bridge) => {
      await db('watchlist_bridges').insert({
        project: String(bridge),
        list_id: profile_id,
      });
    });

    return findWatchlist(profile_id);
  } catch (err) {
    return err;
  }
};

function updateWatchlist(id, change) {
  return db('watchlist')
    .join('watchlist_bridges', 'watchlist.id', 'watchlist_bridges.list_id')
    .where({ 'watchlist.profile_id': id })
    .update(change);
}

function removeWatchlist(user_id, bridge_id) {
  return db('watchlist_bridges')
    .join('watchlist', 'watchlist_bridges.list_id', 'watchlist.id')
    .where({
      'watchlist.profile_id': user_id,
      'watchlist_bridges.project': bridge_id,
    })
    .del();
}

module.exports = {
  findWatchlist,
  addWatchlist,
  updateWatchlist,
  removeWatchlist,
};

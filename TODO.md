# TODO
- 

# COMPLETED
- Rest timer now docks directly above the bottom nav (mobile) / viewport bottom (desktop) as a full-width bar instead of a floating pill, and the dismiss (X) button is bigger (44px tap target).
- "Load entry failed"-style errors no longer get stuck on screen: the error banner is cleared at the start of every set action (log/edit/toggle/delete) and now has its own dismiss button. Also hardened the optimistic-set temp ID to avoid collisions when logging sets in quick succession.
- Inputs on a completed (greyed-out/double-checked) set are now disabled so you can't edit the weight/reps until you un-complete it.
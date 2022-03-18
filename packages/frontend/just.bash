export _JUST_THIS_ROOT="$1";

function just_build {
  yarn --cwd "$_JUST_THIS_ROOT" build;
}

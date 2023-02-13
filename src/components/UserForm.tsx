import {ChangeEvent, FormEvent, useCallback, useState} from "react";
import User from "../types/User";
import {v4} from "uuid";
import {useMutation} from "@tanstack/react-query";
import {AxiosError} from "axios";

export default function UserForm () {
  const [user, setUser] = useState<User>({
    id: v4(),
    first_name: "",
    last_name: "",
    email: "",
    avatar: "",
  });

  const mutation = useMutation<User, AxiosError, User>({
    mutationKey: ['post', '/users']
  });

  const change = useCallback((
      e: ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;

      setUser({
        ...user,
        [name]: value,
      });
    }, [user]
  );

  const submit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(user);
    setUser({
      id: v4(),
      first_name: "",
      last_name: "",
      email: "",
      avatar: "",
    });
  }, [mutation, user]);

  return (
    <form onSubmit={submit}>
      <div>
        <div>
          <label>
            First Name
            <input name="first_name" value={user.first_name} onChange={change}/>
          </label>
        </div>

        <div>
          <label>
            Last Name
            <input name="last_name" value={user.last_name} onChange={change}/>
          </label>
        </div>

        <div>
          <label>
            Email
            <input name="email" value={user.email} onChange={change}/>
          </label>
        </div>

        <button type="submit" disabled={mutation.isLoading}>Save</button>
      </div>
    </form>
  )
}
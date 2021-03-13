import { differenceInYears } from 'date-fns'
import PersonService from "../services/person.service";
import { formatName } from "../utils/formatters"

export const prefill = async (field) => {
  const user = await PersonService.getCurrentUser();

  const returnName = (user) => {
    return formatName(user.personal_data.first_name, user.personal_data.last_name, user.personal_data.nickname);
  };
  
  const returnEmail = (user) => {
    return user.email;
  };

  const returnPhone = (user) => {
    return user.personal_data.phone;
  };

  const returnAge = (user) => {
    let birthDate = new Date(user.personal_data.birthDate)
    return differenceInYears(new Date(), birthDate);
  };

  const returnPlayerProfile = (user) => {
    return user.profile_data.player_profile;
  };

  const fields = {
    name: returnName(user),
    email: returnEmail(user),
    phone: returnPhone(user),
    age: returnAge(user),
    player_profile: returnPlayerProfile(user)
  };

  return fields[field];
}; 






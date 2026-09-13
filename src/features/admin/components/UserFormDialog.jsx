import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '../../../components/ui/Dialog';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Role } from '../../../domain/enums';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
  phoneNumber: z.string().min(1, 'Phone number is required.'),
  role: z.string().min(1, 'Role is required.'),
});

export default function UserFormDialog({ open, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { firstName: '', lastName: '', email: '', phoneNumber: '', role: Role.SUPERVISOR } });

  async function submit(values) {
    await onSubmit(values);
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Create User" description="A temporary password will be generated and shared with this user.">
      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input id="user-firstName" label="First name" required error={errors.firstName?.message} {...register('firstName')} />
          <Input id="user-lastName" label="Last name" required error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input id="user-email" type="email" label="Email" required error={errors.email?.message} {...register('email')} />
        <Input id="user-phone" type="tel" label="Phone" required error={errors.phoneNumber?.message} {...register('phoneNumber')} />
        <Select id="user-role" label="Role" required error={errors.role?.message} {...register('role')}>
          <option value={Role.ADMIN}>Administrator</option>
          <option value={Role.SUPERVISOR}>Supervisor</option>
        </Select>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create user
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

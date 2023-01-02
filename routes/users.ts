import { Router } from 'express';
import prisma from '../prisma';
import { authRole, authRoleOrPerson } from '../middleware/authPage';
import { UserRole } from '../enums/userRole';

const router = Router();

router.get('/', authRole(UserRole.ADMIN), async (req, res) => {
  const result = await prisma.person.findMany({
    include: {
      address: true,
      contact: true,
      personal: true,
      library_access: true,
      faculty: true,
    },
  });

  res.status(200).send(result);
});

router.get('/:id', authRoleOrPerson(UserRole.ADMIN), async (req, res) => {
  const result = await prisma.person.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      address: true,
      contact: true,
      personal: true,
      library_access: true,
    },
  });

  res.status(200).send(result);

});

router.post('/', authRole(UserRole.ADMIN), async (req, res) => {
  try {
    const newPerson = await prisma.person.create({
      data: {
        ...req.body,

        address: {
          create: {
            ...req.body.address
          }
        },
        contact: {
          create: {
            ...req.body.contact
          }
        },
        personal: {
          create: {
            ...req.body.personal
          }
        },
        library_access: {
          create: {
            ...req.body.library_access
          }
        }
      },

    });
    res.json(newPerson);
  } catch (err) {
    //@ts-ignore
    res.status(500).json({ error: err.message });
  }

});
router.put('/:id', authRoleOrPerson(UserRole.ADMIN), async (req, res) => {
  const result = await prisma.person.update({
    where: {
      id: Number(req.params.id),
    },
    data: {
      ...req.body,

      address: {
        update: {
          ...req.body.address
        }
      },
      contact: {
        update: {
          ...req.body.contact
        }
      },
      personal: {
        update: {
          ...req.body.personal
        }
      },
      library_access: {
        update: {
          ...req.body.library_access
        }
      },
      // faculty: {
      //   update: {
      //     ...req.body.faculty
      //   }
      // }
    },

  });
  res.status(200).send(result);

});
router.delete('/:id', authRole(UserRole.ADMIN), async (req, res) => {

  const result = await prisma.person.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.status(204).send(result);

});


export default router;

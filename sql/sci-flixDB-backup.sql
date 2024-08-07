PGDMP  "                    |        
   Sci-FlixDB    16.3    16.3 ,    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16398 
   Sci-FlixDB    DATABASE     �   CREATE DATABASE "Sci-FlixDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "Sci-FlixDB";
                postgres    false            �           0    0    DATABASE "Sci-FlixDB"    COMMENT     x   COMMENT ON DATABASE "Sci-FlixDB" IS 'This database stores information about the movies and users of the Sci-Flix app.';
                   postgres    false    4831            �            1259    16409 	   directors    TABLE     �   CREATE TABLE public.directors (
    directorid integer NOT NULL,
    name character varying(50) NOT NULL,
    bio character varying(1000),
    birthyear date,
    deathyear date
);
    DROP TABLE public.directors;
       public         heap    postgres    false            �            1259    16408    directors_directorid_seq    SEQUENCE     �   CREATE SEQUENCE public.directors_directorid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.directors_directorid_seq;
       public          postgres    false    218            �           0    0    directors_directorid_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.directors_directorid_seq OWNED BY public.directors.directorid;
          public          postgres    false    217            �            1259    16400    genres    TABLE     �   CREATE TABLE public.genres (
    genreid integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(1000)
);
    DROP TABLE public.genres;
       public         heap    postgres    false            �            1259    16399    genres_genreid_seq    SEQUENCE     �   CREATE SEQUENCE public.genres_genreid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.genres_genreid_seq;
       public          postgres    false    216            �           0    0    genres_genreid_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.genres_genreid_seq OWNED BY public.genres.genreid;
          public          postgres    false    215            �            1259    16425    movies    TABLE       CREATE TABLE public.movies (
    movieid integer NOT NULL,
    title character varying(50) NOT NULL,
    description character varying(1000) NOT NULL,
    directorid integer NOT NULL,
    genreid integer NOT NULL,
    imageurl character varying(300),
    featured boolean
);
    DROP TABLE public.movies;
       public         heap    postgres    false            �            1259    16424    movies_movieid_seq    SEQUENCE     �   CREATE SEQUENCE public.movies_movieid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.movies_movieid_seq;
       public          postgres    false    220            �           0    0    movies_movieid_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.movies_movieid_seq OWNED BY public.movies.movieid;
          public          postgres    false    219            �            1259    16451    user_movies    TABLE     o   CREATE TABLE public.user_movies (
    usermovieid integer NOT NULL,
    userid integer,
    movieid integer
);
    DROP TABLE public.user_movies;
       public         heap    postgres    false            �            1259    16450    user_movies_usermovieid_seq    SEQUENCE     �   CREATE SEQUENCE public.user_movies_usermovieid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.user_movies_usermovieid_seq;
       public          postgres    false    224            �           0    0    user_movies_usermovieid_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.user_movies_usermovieid_seq OWNED BY public.user_movies.usermovieid;
          public          postgres    false    223            �            1259    16444    users    TABLE     �   CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    birth_date date
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16443    users_userid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.users_userid_seq;
       public          postgres    false    222            �           0    0    users_userid_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;
          public          postgres    false    221            /           2604    16412    directors directorid    DEFAULT     |   ALTER TABLE ONLY public.directors ALTER COLUMN directorid SET DEFAULT nextval('public.directors_directorid_seq'::regclass);
 C   ALTER TABLE public.directors ALTER COLUMN directorid DROP DEFAULT;
       public          postgres    false    217    218    218            .           2604    16403    genres genreid    DEFAULT     p   ALTER TABLE ONLY public.genres ALTER COLUMN genreid SET DEFAULT nextval('public.genres_genreid_seq'::regclass);
 =   ALTER TABLE public.genres ALTER COLUMN genreid DROP DEFAULT;
       public          postgres    false    215    216    216            0           2604    16428    movies movieid    DEFAULT     p   ALTER TABLE ONLY public.movies ALTER COLUMN movieid SET DEFAULT nextval('public.movies_movieid_seq'::regclass);
 =   ALTER TABLE public.movies ALTER COLUMN movieid DROP DEFAULT;
       public          postgres    false    220    219    220            2           2604    16454    user_movies usermovieid    DEFAULT     �   ALTER TABLE ONLY public.user_movies ALTER COLUMN usermovieid SET DEFAULT nextval('public.user_movies_usermovieid_seq'::regclass);
 F   ALTER TABLE public.user_movies ALTER COLUMN usermovieid DROP DEFAULT;
       public          postgres    false    223    224    224            1           2604    16447    users userid    DEFAULT     l   ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);
 ;   ALTER TABLE public.users ALTER COLUMN userid DROP DEFAULT;
       public          postgres    false    222    221    222            �          0    16409 	   directors 
   TABLE DATA           P   COPY public.directors (directorid, name, bio, birthyear, deathyear) FROM stdin;
    public          postgres    false    218   �0       �          0    16400    genres 
   TABLE DATA           <   COPY public.genres (genreid, name, description) FROM stdin;
    public          postgres    false    216   4       �          0    16425    movies 
   TABLE DATA           f   COPY public.movies (movieid, title, description, directorid, genreid, imageurl, featured) FROM stdin;
    public          postgres    false    220   -6       �          0    16451    user_movies 
   TABLE DATA           C   COPY public.user_movies (usermovieid, userid, movieid) FROM stdin;
    public          postgres    false    224   9       �          0    16444    users 
   TABLE DATA           N   COPY public.users (userid, username, password, email, birth_date) FROM stdin;
    public          postgres    false    222   Y9       �           0    0    directors_directorid_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.directors_directorid_seq', 8, true);
          public          postgres    false    217            �           0    0    genres_genreid_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.genres_genreid_seq', 6, true);
          public          postgres    false    215            �           0    0    movies_movieid_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.movies_movieid_seq', 13, true);
          public          postgres    false    219            �           0    0    user_movies_usermovieid_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.user_movies_usermovieid_seq', 10, true);
          public          postgres    false    223            �           0    0    users_userid_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_userid_seq', 4, true);
          public          postgres    false    221            6           2606    16416    directors directors_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.directors
    ADD CONSTRAINT directors_pkey PRIMARY KEY (directorid);
 B   ALTER TABLE ONLY public.directors DROP CONSTRAINT directors_pkey;
       public            postgres    false    218            4           2606    16407    genres genres_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (genreid);
 <   ALTER TABLE ONLY public.genres DROP CONSTRAINT genres_pkey;
       public            postgres    false    216            8           2606    16432    movies movies_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (movieid);
 <   ALTER TABLE ONLY public.movies DROP CONSTRAINT movies_pkey;
       public            postgres    false    220            <           2606    16456    user_movies user_movies_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.user_movies
    ADD CONSTRAINT user_movies_pkey PRIMARY KEY (usermovieid);
 F   ALTER TABLE ONLY public.user_movies DROP CONSTRAINT user_movies_pkey;
       public            postgres    false    224            :           2606    16449    users users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    222            =           2606    16438    movies directorkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.movies
    ADD CONSTRAINT directorkey FOREIGN KEY (directorid) REFERENCES public.directors(directorid);
 <   ALTER TABLE ONLY public.movies DROP CONSTRAINT directorkey;
       public          postgres    false    220    4662    218            >           2606    16433    movies genrekey    FK CONSTRAINT     t   ALTER TABLE ONLY public.movies
    ADD CONSTRAINT genrekey FOREIGN KEY (genreid) REFERENCES public.genres(genreid);
 9   ALTER TABLE ONLY public.movies DROP CONSTRAINT genrekey;
       public          postgres    false    216    4660    220            ?           2606    16462    user_movies moviekey    FK CONSTRAINT     y   ALTER TABLE ONLY public.user_movies
    ADD CONSTRAINT moviekey FOREIGN KEY (movieid) REFERENCES public.movies(movieid);
 >   ALTER TABLE ONLY public.user_movies DROP CONSTRAINT moviekey;
       public          postgres    false    220    224    4664            @           2606    16457    user_movies userkey    FK CONSTRAINT     u   ALTER TABLE ONLY public.user_movies
    ADD CONSTRAINT userkey FOREIGN KEY (userid) REFERENCES public.users(userid);
 =   ALTER TABLE ONLY public.user_movies DROP CONSTRAINT userkey;
       public          postgres    false    224    222    4666            �   p  x�u�Ms"9���W��셦���7���Tv6�
��ڭ�#hW�m�0��GrC:�(�-��+��ދZil`!mg� �W����SA�Vʡ�@yph���
��AIe�:�	Jh�[W��Th$�Z�@�@�� J�9�*��d�Xj>�k�&u\!��.�пӂ�h:����g�O��%�����f���㛬(�q���t5�}BC�}WZ����wƽ���7J���>�[G�}Pke6�y�T�o4��K��3Z��� �����R$!����ux�S;���0�'�G�O�`B�b��cF�AVﯸ��V]� ͙@�Y�i[$��p%�"�r��-�9�c���)�f-�9�{l��(ϋ?a���y^5�c��,�T��{��ʊ#��f�Va4��l4�*Lz��4$��%���j��͉ע�.xz��P��Α{��ut}&�d	sr�T�%��~�j�=���d��	׃�bK��lO����D6!�"+�u�Q�艅ҷ�ܼܺ�Nс�����Ks{���.#��!o����;z�=�]C@Y����Z;j&4t�2���*�B%�$���%��I��p���!di��R�P�����7BM���6������$�"��f�t(*n�S��K*	>$��^m}���m�)<��o�S����m�C��,�f���nz/<���e�|�>o�3ݼt�.{ں�.h�^�E�S��5Ei5���v����p��	YA�� �c���$�g�|�����=mB��E�JYd�uVLzF{whh�j�ݼs\����U��^��5mRrI��]v":	*��%u��4�>F'��i�G��I�����Wp"�Nfp��>N�I�K�H������iV��b��?�WWW���|D      �   �  x�}RKn�0]ۧ�f����@V9A7�D�ldѡhO�ӗ�8����>~ ߇����9�����e�	mQ�A1G����D9`i�r��:��m�|N����:Xkʅh�<@FU4^	PC�����9�� \ a�H�a�#��.
*~:4�v�'vr(�%���)��l^�B�!H6�fQԭ�3/u��YTE����n6R�!S�y���&Q}���*o��'��bUTu{M�Iܾr�9�	�(�*�9c���o����c�����q��7�`����(�l�ɡ��x��*�߫K	}�I�w���-�J�>4?'��k/a�y�/jO`�$s�r/GP�#��?��
���4I5t{]��<���3�:��0}�3�ߞr�m�#�:����Rp�>�
X�?�=������/T��_]۶��      �   �  x�ET͎7>k���1��l��涗h4{̅�p<�5—��ۗ��[�0E~������g8��#��êJk8�%iÜW��JI�ӻ1-)�\2��;�Ѕs���#�<�"�l��$�B*0-�>i��>��j߇��[Ɓ�D�@0��d��V����c��^esKU�Z@���g
�A�:�Lp\����N0%��pS]w��>������:D�+���_Y���p�Z�1@0*���ۢ߁�F��evzէhӅ����C��}������",��j�����u���P�P*J�vEHɎ�M��D6�$�G'\�Ni��c�V�&]�S��ҬN7!3��ŕaA��	;P�Ʋ�}��̩`e�Xe*.�B\�,6Sթ�4�n�`4ͺ~�s>�r��6l�߹��^0���ˍ�b㚴b�,:N2</�h��k��VI?˄�lׇ��/���ԉ�ӓf��[���l�w����:R�[���u���L0�#3.���ߐ���`I�`6��j�����F��VRt�{�n[�Mo�z%ST;�V/�����9ˮ]7h��z�m�7є���y�z
�B��J��+�oh<T�4ܨ����Z��M
�`č��>�y��l�Ho�\�s�g��/|5��y���1�&�:��j�ßMz�ٹ'���@Y]�<��M��.>�ʊ�=5���f���p�x2&�u��Z�h����hɖ�WߥޅO���������?ӽ4      �   *   x�3�4�4�2��\@�И˒ӄӒ�� Hr��qqq ^��      �   �   x�e��� ��˻� ֟�|/k�D\4�}z)zИ�m��70�#'�rpɂ�Z���r�M�8t7�s �u�Ѫѝ����BѮ�98JPQ9b�~aFiݨ5��cf|�W!dK2a3��ը%��w����KE=�ٴ{��o3�ۯy�1���˸L�     